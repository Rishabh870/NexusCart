import React, { useEffect, useState } from "react";
import ProductCardAdmin from "../AdminComponents/ProductCardAdmin";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Container } from "react-bootstrap";
import { userRequest } from "../requestMethods";
import AddProductModal from "../AdminComponents/AddProductModal";
import { styled } from "styled-components";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

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
const ProductContainer = styled.div`
  min-height: 70vh;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    li {
      margin: 0 5px;
      a {
        padding: 5px 10px;
        border: 1px solid #ccc;
        color: #000000;
        text-decoration: none;
        &:hover {
          background-color: #000000;
          color: #ffffff;
        }
      }
    }
    .active a {
      background-color: #333;
      color: #fff;
    }
    .disabled a {
      pointer-events: none;
      color: #ccc;
    }
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
  const [currentPage, setCurrentPage] = useState(0);

  const productsPerPage = 9;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = products.slice(startIndex, endIndex);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
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

    const fetchAllProducts = async () => {
      try {
        const params = {};
        const response = await userRequest.get("/product/products", {
          params,
        });
        setLoading(false);

        setProducts(response.data);
      } catch (error) {
        toast.error(error.response.data.error);
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
          style={{ minHeight: "80vh", fontFamily: "Playfair Display, serif" }}
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
          <div className="row mx-auto" style={{ width: "100%" }}>
            {productsToDisplay.map((product) => (
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
      <PaginationContainer>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
      </PaginationContainer>
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
