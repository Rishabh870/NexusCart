import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Import the required icons
import { FaTimes, FaPlus } from "react-icons/fa";
import { userRequest } from "../requestMethods";
import { BASE_URL } from "../requestMethods";
import { toast } from "react-toastify";
const ImageContainer = styled.div`
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
const ModalContent = styled.div`
  padding: 20px;
`;

const PlusIcon = styled.div`
  position: relative;
  top: 45%;
  left: 50%;
  padding-left: 45%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  background-color: black !important;
  border-color: #000000 !important;
  color: white;
  border-radius: 0%;
`;
const CloseButton = styled(Button)`
  background-color: white !important;
  border-color: black !important;
  color: black !important;
  border-radius: 0%;
`;

const EditProductModal = ({ show, onHide, productData }) => {
  const [product, setProduct] = useState(productData);
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    desc: "",
    price: "",
    inStock: true,
    imagePreviews: [],
    category: "",
    sizeInput: [],
    dropBrands: [],
    dropCategories: [],
  });

  useEffect(() => {
    const getCategorysAndBrands = async () => {
      try {
        const categories = await userRequest.get("/category/categories");
        const brands = await userRequest.get("/brand/brands");
        const mergedFormData = {
          ...formData,
          dropCategories: categories.data,
          dropBrands: brands.data,
          productName: productData.productName,
          brandName: productData.brandName,
          desc: productData.desc,
          price: productData.price,
          inStock: productData.inStock,
          category: productData.category,
          sizeInput: productData.sizes.join(", "),
        };
        setFormData(mergedFormData);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getCategorysAndBrands();
  }, [productData]);

  const handleSubmit = async () => {
    const form = new FormData();
    // Split the sizeInput string by commas and trim spaces from each word

    const img = [];
    let image = false;
    for (const file of product.img) {
      if (file.startsWith("uploads" || "uploads/" || "uploads\\")) {
        // Store the file path in the imagePreview array

        img.push(file);
      } else {
        // Convert base64 image data to a Blob
        const base64Response = await fetch(file);
        const blob = await base64Response.blob();

        // Create a unique filename for the image (you may use any method to generate unique names)
        const fileName = `uploaded_image_${Date.now()}.jpg`;
        // Append the Blob to the formData with a filename
        form.append("myImages", blob, fileName);
        image = true;
      }
    }
    try {
      if (image) {
        const response = await userRequest.post("/product/imagesupload", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        response.data.imagePaths.forEach((item) => {
          if (Array.isArray(item)) {
            // If the item is an array, spread its elements into imagePreview
            img.push(...item);
          } else {
            img.push(item);
          }
        });

        image = false;
      }
      // Update the formData state with the imagePreviews array
      const sizeArray = formData.sizeInput
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size !== "");

      const sizes = sizeArray.map((size) => size.toUpperCase());

      await userRequest
        .put(`/product/products/${productData._id}`, {
          productName: formData.productName.toUpperCase(),
          brandName: formData.brandName.toUpperCase(),
          desc: formData.desc.toUpperCase(),
          price: formData.price,
          inStock: formData.inStock,
          category: formData.category.toUpperCase(),
          sizes,
          img,
        })
        .then((response) => {
          // Handle the response if needed
          toast.success("Product Updated");
        })
        .catch((error) => {
          // Handle errors if the request fails
          console.error(error);
          toast.error(error.response.data.message);
        });

      onHide();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    // Make a POST request to the '/addproduct' route using userRequest
  };

  const handleImageChange = (e) => {
    // Get the selected files from the input element
    const files = Array.from(e.target.files);
    // Check if adding the selected files will exceed the maximum allowed number of images
    if (product.img.length + files.length > 4) return;
    // Create a new array to store the updated image previews
    const newPreviews = [...product.img];
    // Process each selected file
    files.forEach((file) => {
      // Create a new FileReader instance
      const reader = new FileReader();
      // Define an event listener for the "loadend" event of the FileReader
      reader.onloadend = () => {
        // Push the result of the FileReader to the newPreviews array
        newPreviews.push(reader.result);
        // Update the product state by setting the "img" property to the newPreviews array
        setProduct((prev) => ({ ...prev, img: newPreviews }));
      };
      // Read the file as a data URL
      if (file) reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    // Create a new array of image previews using the spread operator
    const newPreviews = [...product.img];
    // Remove the image at the specified index from the new array
    newPreviews.splice(index, 1);
    // Update the product state by replacing the image previews with the new array
    setProduct((prev) => ({ ...prev, img: newPreviews }));
  };
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <ModalContent>
          <Form.Group className="mb-2">
            <div className="d-flex">
              {/* Check if imagePreviews is an array (editing mode) */}
              {product.img.map((file, index) => (
                <ImageContainer key={index}>
                  {file.toString().includes("data") ? (
                    <img
                      src={file}
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="mr-2"
                    />
                  ) : (
                    <img
                      src={`${BASE_URL}/` + file}
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="mr-2"
                    />
                  )}
                  <DeleteButton onClick={() => handleDeleteImage(index)}>
                    <FaTimes />
                  </DeleteButton>
                </ImageContainer>
              ))}

              {product.img.length < 4 && (
                <div
                  className="border"
                  style={{ width: "100px", height: "100px" }}
                >
                  <label
                    htmlFor="fileInput"
                    style={{ width: "100%", height: "100%", cursor: "pointer" }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInput"
                      style={{ display: "none" }}
                      multiple
                      onChange={handleImageChange}
                    />
                    <PlusIcon>
                      <AiOutlinePlus />
                    </PlusIcon>
                  </label>
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="Product Name"
            />
          </Form.Group>
          <Form.Group className="row w-100 mx-auto mb-2">
            <div className="col-6 p-0 pr-1">
              <Form.Control
                as="select"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData({ ...formData, brandName: e.target.value })
                }
              >
                <option value="">Select Brand</option>
                {formData?.dropBrands?.map((brand, index) => (
                  <option key={index} value={brand.name.toUpperCase()}>
                    {brand?.name.toUpperCase()}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="col-6 p-0 pl-1">
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {formData.dropCategories?.map((category, index) => (
                  <option key={index} value={category.name.toUpperCase()}>
                    {category.name.toUpperCase()}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              placeholder="Product Description"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <div className="d-flex">
              <Form.Control
                as="input"
                type="text"
                placeholder="Enter Sizes separated by ','"
                value={formData.sizeInput}
                onChange={(e) =>
                  setFormData({ ...formData, sizeInput: e.target.value })
                }
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="In Stock"
              checked={formData.inStock}
              onChange={(e) =>
                setFormData({ ...formData, inStock: e.target.checked })
              }
            />
          </Form.Group>
        </ModalContent>
      </Modal.Body>
      <Modal.Footer>
        <CloseButton onClick={onHide}>Close</CloseButton>
        <StyledButton onClick={handleSubmit}>Save Changes</StyledButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
