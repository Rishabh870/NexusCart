import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../Components/Header";
import Filter from "../Components/Filters";
import ProductCard from "../Components/ProductCard";
import Footer from "../Components/Footer";
import { styled } from "styled-components";
import { userRequest } from "../requestMethods";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Product = styled.div`
  min-height: 70vh;
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

const AllProducts = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8; // Set the number of products to display per page

  const [products, setProducts] = useState([]);
  const [update, setUpdate] = useState("");
  const location = useLocation();
  const urlSearch = new URLSearchParams(window.location.search);
  const searchQuery = urlSearch.get("searchQuery");
  const category = urlSearch.get("category");
  const brand = urlSearch.get("brand");

  useEffect(() => {
    setLoading(true);
    const fetchAllProducts = async () => {
      try {
        const params = {};
        let response;

        if (searchQuery) {
          params.searchQuery = searchQuery;
        }

        if (category) {
          params.category = category.split(",");
        }

        if (brand) {
          params.brand = brand.split(",");
        }

        response = await userRequest.get("/product/products", {
          params,
        });

        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllProducts();
  }, [update, brand, category, searchQuery]);

  const pageCount = Math.ceil(products.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = products.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <Header />
      {loading ? (
        <div
          style={{ minHeight: "82vh" }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container style={{ minHeight: "82vh" }}>
          <ProductContainer className="row">
            <div id="left" className="col-3 pr-4">
              <Filter setUpdate={setUpdate} update={update} />
            </div>
            <div id="right" className="col-9 pl-4 ">
              <Product className="row mt-5">
                {currentProducts.map((product, index) => {
                  return (
                    <div
                      className="col-lg-4 col-sm-6 col-xl-3 p-0 px-xl-1 px-md-3"
                      key={index}
                    >
                      <Link
                        to={`/product/${product._id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ProductCard product={product} />
                      </Link>
                    </div>
                  );
                })}
              </Product>
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
            </div>
          </ProductContainer>
        </Container>
      )}
      <Footer />
    </>
  );
};

export default AllProducts;
