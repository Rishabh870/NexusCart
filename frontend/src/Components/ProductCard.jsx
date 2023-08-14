import React, { useState } from "react";
import styled from "styled-components";
import Img1 from "../Img/Img4.webp";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { BASE_URL } from "../requestMethods";

const CardContainer = styled.div`
  width: 100%;
  max-width: 210px;
  max-height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;
const Brand = styled.h3`
  font-size: 15px;
  color: black;
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-family: "Playfair Display", sans-serif;
`;
const ProductName = styled.h4`
  font-size: 12px;
  color: gray;
  margin: 8px 0;
  font-family: "Josefin Sans ";
`;
const Price = styled.span`
  font-size: 14px;
  color: #333;
  font-family: "Poppins", sans-serif;
`;
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
`;
const FilledStar = styled(AiFillStar)`
  color: gold; /* Change the filled star color here */
`;
const OutlineStar = styled(AiOutlineStar)`
  color: gold; /* Change the outline star color here */
`;
const ProductImageSliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
`;
const ProductImage = styled.img`
  height: 100%;
  width: 100%;
  display: block;
  overflow-clip-margin: content-box;
  overflow: clip;

  transition: filter 0.3s ease-in-out;

  ${CardContainer}:hover & {
    filter: brightness(50%);
  }
`;
const CartContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 7.3rem;
  background-color: white;
  width: 100%;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  text-align: center;
  display: flex;
  padding: 0.3rem;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;
const CartButton = styled.span`
  border: 2px solid gray;
  padding: 0.3rem 1.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Playfair Display", serif;
`;
const CartIcon = styled(AiOutlineHeart)`
  margin-right: 0.3rem;
  font-size: 1.1rem;
  margin-bottom: 0.1rem;
`;

const ProductCard = ({ product }) => {
  const value = product.averageRating;
  const filledStars = Math.floor(value);
  const hasHalfStar = value - filledStars >= 0.5;

  const stars = [];
  for (let i = 0; i < filledStars; i++) {
    stars.push(<FilledStar key={i} />);
  }

  if (hasHalfStar) {
    stars.push(<OutlineStar key={filledStars} />);
  }

  const remainingStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<OutlineStar key={filledStars + i + (hasHalfStar ? 1 : 0)} />);
  }
  const [isCartHovered, setCartHovered] = useState(false);

  return (
    <CardContainer
      className="card mb-3"
      onMouseEnter={() => setCartHovered(true)}
      onMouseLeave={() => setCartHovered(false)}
    >
      <ProductImageSliderContainer className="card-img-top">
        <ProductImage src={product.img[0]} />
      </ProductImageSliderContainer>

      <CardContent className="card-body pt-2 px-3">
        <Brand className="card-text">{product.brandName}</Brand>
        <ProductName className="card-title my-1">
          {product.productName.length > 23
            ? product.productName.substring(0, 23) + "..."
            : product.productName}
        </ProductName>
        <Price className="card-text">${product.price}</Price>
        <RatingContainer className="mt-2">{stars}</RatingContainer>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;
