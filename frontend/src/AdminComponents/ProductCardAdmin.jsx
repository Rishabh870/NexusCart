import React, { useState } from "react";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";
import EditProductModal from "./EditProductModal";
import { BASE_URL } from "../requestMethods";
import { toast } from "react-toastify";

const CardContainer = styled.div`
  display: flex;
  position: relative;
  max-width: 420px;
  font-family: "Josefin Sans, serif !important";
  min-width: 250px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProductInfo = styled.div`
  flex: 1;
  width: 17rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 14px;
  margin-bottom: 5px;
  color: gray;
`;

const BrandName = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
  font-size: 16px;
`;

const Price = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Category = styled.p`
  font-size: 14px;
  color: gray;
  margin-bottom: 5px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  right: 0%;
`;

const Button = styled.button`
  background-color: transparent;
  position: relative;
  padding: 5px 10px;
  margin-right: 5px;
  height: fit-content;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselContainer = styled.div`
  margin-right: 10px;
  width: 120px;
`;

const SizeContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const SizeButton = styled.span`
  display: flex;
  margin-right: 0.5rem;
  font-size: x-small;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  color: "#000";
`;

const ProductCardAdmin = ({ product, setUpdate, update }) => {
  const [showModal, setShowModal] = useState(false);
  const editProduct = async () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdate(!update);
  };

  const deleteProduct = async () => {
    try {
      const response = await userRequest.delete(
        `/product/products/${product._id}`
      );
      toast.success("Product Deleted");
      setUpdate(!update);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const responsive = {
    Laptop: {
      breakpoint: { max: 8000, min: 770 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 769, min: 0 },
      items: 1,
    },
  };

  return (
    <CardContainer className="">
      <Link
        to={`/product/${product._id}`}
        className="d-flex"
        style={{ textDecoration: "none", color: "black" }}
      >
        <CarouselContainer>
          <Carousel
            swipeable={true}
            draggable={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            className=""
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["Laptop", "mobile"]}
            itemClass="carousel-item-padding-40-px"
            showDots="true"
          >
            {product.img.map((src) => {
              return (
                <div style={{ borderRadius: "30px" }}>
                  <img
                    src={`${BASE_URL}/` + src}
                    alt=""
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              );
            })}
          </Carousel>
        </CarouselContainer>
        <ProductInfo>
          <BrandName>{product.brandName} </BrandName>
          <ProductName>{product.productName}</ProductName>
          <Price>${product.price}</Price>
          <Category>{product.category}</Category>
          <SizeContainer>
            {product.sizes.map((size, index) => (
              <SizeButton key={index}>{size}</SizeButton>
            ))}
          </SizeContainer>
        </ProductInfo>
      </Link>
      <ButtonsContainer>
        <Button onClick={editProduct}>
          <FaEdit />
        </Button>
        <Button onClick={deleteProduct}>
          <FaTrash />
        </Button>
      </ButtonsContainer>
      <EditProductModal
        show={showModal}
        onHide={handleCloseModal}
        productData={product}
      />
    </CardContainer>
  );
};

export default ProductCardAdmin;
