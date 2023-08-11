import React, { useEffect, useState } from "react";
import ProductCardAdmin from "../AdminComponents/ProductCardAdmin";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Container } from "react-bootstrap";
import { userRequest } from "../requestMethods";
import AddProductModal from "../AdminComponents/AddProductModal";
import { styled } from "styled-components";
import { Button, Modal, Form } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormContainer = styled.div`
  display: flex;
  font-family: "Playfair Display", serif;

  flex-direction: column;
`;
const FormLabel = styled.label`
  margin-bottom: 0.5rem;
`;
const FormInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
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
  outline: none !important;
`;
const HeadingWrapper = styled.div`
  flex: 1;
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
`;
const ProductBtn = styled.button`
  padding: 0.3rem 1rem;
  border: 1.5px solid black;
  background-color: transparent;
  &:hover {
    background-color: black;
    color: white;
  }
  padding: 0.3rem 1rem;
  color: white;
  border: 1.5px solid black;
  background-color: black;
  &:hover {
    background-color: white;
    color: black;
  }
`;
const AddBtn = styled.button`
  margin-right: 10px;
  padding: 0.3rem 1rem;
  border: 1.5px solid black;
  background-color: transparent;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [categories, setCategories] = useState("");
  const [brands, setBrands] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (categories === "" && brands === "") {
      return toast.error("Category and Brand are required");
    }

    const categoriesArray = categories
      .split(",")

      .map((category) => ({
        name:
          category.trim().charAt(0).toUpperCase() + category.trim().slice(1),
      }))
      .filter((category) => category.name !== "");

    const brandsArray = brands
      .split(",")
      .map((brand) => ({
        name: brand.trim().charAt(0).toUpperCase() + brand.trim().slice(1),
      }))
      .filter((brand) => brand.name !== "");

    if (categoriesArray.length > 0) {
      const response = await userRequest.post("/category/add", categoriesArray);
      toast.success("Category added successfully");
    }

    if (brandsArray.length > 0) {
      const response = userRequest.post("/brand/add", brandsArray);
      toast.success("Brand added successfully");
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShow(false);
    setBrands("");
    setCategories("");
    setUpdate(!update);
    navigate("/admin/products");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    setLoading(true);
    console.log("updated");
    const fetchAllProducts = async () => {
      try {
        const params = {};
        const response = await userRequest.get("/product/products", {
          params,
        });
        setLoading(false);
        console.log(response.data);

        setProducts(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [showModal, brands, categories, show, update]);

  return (
    <div>
      <Header setUpdate={setUpdate} update={update} />
      {loading ? (
        <div
          style={{ height: "100vh" }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container
          fluid
          className=" px-5 mx-auto"
          style={{ minHeight: "90vh", fontFamily: "Playfair Display, serif" }}
        >
          <div className="d-flex justify-content-between mb-4">
            <HeadingWrapper>Products</HeadingWrapper>
            <AddBtn
              onClick={() => {
                setShow(true);
              }}
            >
              Add Categories And Brands
            </AddBtn>
            <ProductBtn onClick={handleShowModal}>Add Product</ProductBtn>
          </div>
          <div className="row" style={{ width: "100%" }}>
            {products.map((product) => (
              <div className="col-6 col-xl-4 mb-3">
                <ProductCardAdmin
                  key={product.id}
                  product={product}
                  update={update}
                  setUpdate={setUpdate}
                />
              </div>
            ))}
          </div>
        </Container>
      )}
      <Footer />
      <AddProductModal
        show={showModal}
        setUpdate={setUpdate}
        update={update}
        onHide={handleCloseModal}
      />
      <Modal
        style={{
          fontFamily: "Playfair Display, serif",
        }}
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header>
          <Modal.Title>Add Categories and Brands</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormContainer>
            <FormLabel>Categories (separate with comma):</FormLabel>
            <FormInput
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />

            <FormLabel>Brands (separate with comma):</FormLabel>
            <FormInput
              type="text"
              value={brands}
              onChange={(e) => setBrands(e.target.value)}
            />
          </FormContainer>
        </Modal.Body>
        <Modal.Footer>
          <CloseButton onClick={() => setShow(false)}>Close</CloseButton>
          <StyledButton onClick={handleFormSubmit}>Submit</StyledButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProductPage;
