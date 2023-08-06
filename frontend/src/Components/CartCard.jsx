import React, { useState } from "react";
import styled from "styled-components";
import { RxCross1 } from "react-icons/rx";
import { userRequest } from "../requestMethods";
import { useDispatch } from "react-redux";
import {
  deleteCartItem,
  updateCartItem,
  getCartProduct,
} from "../Redux/cartReducer";
import { TbTruckDelivery } from "react-icons/tb";
import { BASE_URL } from "../requestMethods";

const CardContainer = styled.div`
  border: 1px solid #dee2e6;
  padding: 15px;
`;

const Image = styled.img`
  max-width: 130px;
  width: 100%;
  object-fit: fill;
  height: 100%;
  max-height: 150px;
`;

const Brand = styled.p`
  text-align: start;
  margin: 0;
  font-size: 0.9rem;
  color: gray;
  font-family: "Playfair Display", sans-serif;
`;

const ProductName = styled.p`
  text-align: start;
  margin: 0;
  font-weight: 600;
  font-size: 1.2rem;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Josefin Sans Regular";
`;

const DropTitle = styled.span`
  font-weight: bold;
  font-size: 1rem;
  font-family: "Josefin Sans", sans-serif;
`;

const Dropdown = styled.select`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  padding: 3px;
  border: none;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  &:focus {
    outline: none;
  }
`;

const Price = styled.p`
  margin-bottom: 0.5rem;
  text-align: start;
  font-size: 0.9rem;
  font-family: "Poppins", sans-serif;
  font-weight: bolder;
`;

const FreeDelivery = styled.p`
  text-align: start;
  color: green;
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Josefin Sans Regular";
`;

const CartCard = ({ data, show }) => {
  const [selectedSize, setSelectedSize] = useState(data?.selectedSize || "");
  const [selectedQuantity, setSelectedQuantity] = useState(
    data?.quantity || ""
  );

  const dispatch = useDispatch();

  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    console.log(data._id);
    setSelectedSize(newSize);
    Dispatch(data.cartId, selectedQuantity, newSize);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    setSelectedQuantity(newQuantity);

    Dispatch(data.cartId, newQuantity, selectedSize);
  };

  const Dispatch = (id, qualtity, size) => {
    const data = {
      id: id,
      quantity: qualtity,
      selectedSize: size,
    };
    dispatch(updateCartItem(data));
  };

  const handleDeleteItem = () => {
    // Perform the delete request using userRequest
    console.log(data.cartId);
    dispatch(deleteCartItem(data.cartId));
  };

  console.log(data);
  return (
    <CardContainer className="row border p-2 px-0 mb-2 mx-1">
      <div className="col-3 px-1">
        <Image src={`${BASE_URL}/` + data.img[0]} alt={data.productName} />
      </div>
      <div className="col-8 px-2 d-flex flex-column justify-content-center">
        <ProductName>{data._id && data.productName}</ProductName>

        <Brand>{data._id && data.brandName} </Brand>
        <div className="d-flex ">
          <div className="mr-3">
            <DropTitle>Size:</DropTitle>
            <Dropdown
              value={selectedSize}
              disabled={!show}
              onChange={handleSizeChange}
            >
              <option value="">Select size</option>
              {data?.sizes.map((size) => (
                <option value={size} key={size}>
                  {size}
                </option>
              ))}
            </Dropdown>
          </div>
          <div className="mr-3">
            <DropTitle>Qty:</DropTitle>
            <Dropdown
              value={selectedQuantity}
              disabled={!show}
              onChange={handleQuantityChange}
            >
              <option value="" disabled>
                Select quantity
              </option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map(
                (qty) => (
                  <option value={qty} key={qty}>
                    {qty}
                  </option>
                )
              )}
            </Dropdown>
          </div>
        </div>
        <Price>${data._id && (data.price * data.quantity).toFixed(2)}</Price>
        <FreeDelivery>
          Free Delivery <TbTruckDelivery size={17} color="green" />
        </FreeDelivery>
      </div>
      <div className={show ? "" : "d-none"}>
        <span onClick={handleDeleteItem}>
          <RxCross1 />
        </span>
      </div>
    </CardContainer>
  );
};

export default CartCard;
