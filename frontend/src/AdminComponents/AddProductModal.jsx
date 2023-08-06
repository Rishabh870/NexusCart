import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"; // Import the required icons
import { FaTimes, FaPlus } from "react-icons/fa";
import { userRequest } from "../requestMethods";

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
const SizeInput = styled.input`
  /* Add your own styles here */
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

const AddProductModal = ({ show, onHide, productData }) => {
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]); // Updated state initialization
  const [category, setCategory] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [dropBrands, setDropBrands] = useState([]);
  const [dropCategories, setDropCategories] = useState([]);

  const handleSizeInputChange = (e) => {
    const input = e.target.value;
    // Remove spaces from the input using regex
    const sanitizedInput = input.replace(/\s/g, "");
    setSizeInput(sanitizedInput);
  };

  useEffect(() => {
    const getProduct = async () => {
      // Convert image URLs to File objects when editing a product
      if (productData) {
        const imageFiles = await Promise.all(
          productData.img.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            // Get the file type directly from the blob
            const extension = url.substring(url.lastIndexOf(".") + 1);

            // Set the file type based on the file extension
            const fileType = `image/${
              extension === "jpg" ? "jpeg" : extension
            }`;
            return new File(
              [blob],
              `image-${Date.now()}.${fileType.split("/")[1]}`,
              { type: fileType }
            );
          })
        );
        setImagePreviews(imageFiles);
        setProductName(productData.productName);
        setBrandName(productData.brandName);
        setDesc(productData.desc);
        setPrice(productData.price);
        setInStock(productData.inStock);
        setCategory(productData.category); // Convert array of categories to comma-separated string
        setSizeInput(productData.sizes.join(", ")); // Convert array of sizes to comma-separated string
      }
    };

    const getCategorysAndBrands = async () => {
      try {
        const categories = await userRequest.get("/category/categories");
        setDropCategories(categories.data);
        const brands = await userRequest.get("/brand/brands");
        setDropBrands(brands.data);
      } catch (error) {}
    };
    getCategorysAndBrands();
    getProduct();
  }, [productData]);
  const handleSubmit = () => {
    try {
      const formData = new FormData();
      // Split the sizeInput string by commas and trim spaces from each word
      const sizeArray = sizeInput.split(",").map((size) => size.trim());

      // Convert each word to uppercase
      const sizesArrayUppercase = sizeArray.map((size) => size.toUpperCase());
      // Append each form field to the formData
      formData.append("productName", productName);
      formData.append("brandName", brandName);
      formData.append("desc", desc);
      formData.append("price", price);
      formData.append("inStock", inStock);
      sizesArrayUppercase.forEach((size) => {
        formData.append("sizes", size);
      }); // Convert array of sizes to comma-separated string
      formData.append("category", category);

      // Append each image to the formData
      imagePreviews.forEach((file, index) => {
        formData.append("myImages", file); // Use the correct field name 'images'
      });

      if (productData) {
        userRequest
          .put(`/product/products/${productData._id}`, formData)
          .then((response) => {
            // Handle the response if needed
            // console.log(response.data);
          })
          .catch((error) => {
            // Handle errors if the request fails
            console.error(error);
          });
      } else {
        userRequest
          .post("/product/addproduct", formData)
          .then((response) => {
            // Handle the response if needed
            // console.log(response.data);
          })
          .catch((error) => {
            // Handle errors if the request fails
            console.error(error);
          });
      }
      onHide();
      setBrandName("");
      setCategory("");
      setSizeInput("");
      setProductName("");
      setDesc("");
      setPrice("");
      setInStock(true);
      setImagePreviews([]);
    } catch (error) {
      console.log(error);
    }
    // Make a POST request to the '/addproduct' route using userRequest
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newPreviews = [];

    // Limit the number of selected images to 4
    const maxAllowed = Math.min(4, files.length);

    for (let i = 0; i < maxAllowed; i++) {
      const file = files[i];
      newPreviews.push(file);
    }

    // If productData is not available (creating a product), use the image URLs directly
    setImagePreviews(newPreviews);
  };

  const handleDeleteImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>
          {productData ? "Edit Product" : "Add Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <ModalContent>
          <Form.Group className="mb-2">
            <div className="d-flex">
              {/* Check if imagePreviews is an array (editing mode) */}
              {Array.isArray(imagePreviews) &&
                imagePreviews.map((file, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={
                        typeof file === "string"
                          ? file
                          : URL.createObjectURL(file)
                      }
                      alt=""
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="mr-2"
                    />
                    <DeleteButton onClick={() => handleDeleteImage(index)}>
                      <FaTimes />
                    </DeleteButton>
                  </ImageContainer>
                ))}

              {imagePreviews.length < 4 && (
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
            />
          </Form.Group>
          <Form.Group className="row w-100 mx-auto mb-2">
            <div className="col-6  p-0 pr-1">
              <Form.Control
                as="select"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              >
                <option value="">Select Brand</option>
                {dropBrands.map((brand, index) => (
                  <option key={index} value={brand.name}>
                    {brand?.name}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="col-6 p-0 pl-1">
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {dropCategories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Product Description"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <div className="d-flex">
              <Form.Control
                as="input"
                type="text"
                placeholder="Enter Sizes separated by ','"
                value={sizeInput}
                onChange={handleSizeInputChange}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="In Stock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
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

export default AddProductModal;
