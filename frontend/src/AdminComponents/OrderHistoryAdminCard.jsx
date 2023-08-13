import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const OrderCardContainer = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const OrderTitle = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Josefin Sans regular";
`;

const OrderInfoItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Josefin Sans regular";
  text-align: center;
`;
const Button = styled.button`
  background-color: black;
  color: #fff;
  border: none;
  border: 2px solid black;
  font-size: small;
  padding: 0.3rem 1rem;
  cursor: pointer;
`;
const Details = styled(Link)`
  background-color: white;
  padding: 0;
  text-decoration: none;
  margin-right: 0.5rem;
  color: black;
  border: 2px solid black;
  font-size: small;
  padding: 0.3rem 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    color: black;
  }
`;
const OrderHistoryAdminCard = ({
  orderId,
  date,
  total,
  paid,
  delivery,
  userId,
  update,
  setUpdate,
}) => {
  const formattedDate = date?.split("T")[0]; // Extract the date portion

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await userRequest.delete(
        `/order/delete/${orderId}/${userId._id}`
      );
      setUpdate(!update);
      toast.success("Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const fullName = userId?.fullName;
  const truncatedName =
    fullName?.length > 8 ? fullName?.substring(0, 7) + "..." : fullName;

  return (
    <>
      <OrderCardContainer className="row">
        <OrderTitle className="col-3 p-0">{orderId}</OrderTitle>
        <OrderInfoItem className="col-1 p-0">{truncatedName}</OrderInfoItem>
        <OrderInfoItem className="col-2 p-0"> {formattedDate}</OrderInfoItem>
        <OrderInfoItem className="col-1 p-0"> ${total}</OrderInfoItem>
        <OrderInfoItem className="col-1 p-0"> {paid}</OrderInfoItem>
        <OrderInfoItem className="col-1 p-0"> {delivery}</OrderInfoItem>
        <OrderInfoItem className="col-3 p-0">
          <Details to={`/order/${orderId}`}>Details</Details>
          <Button onClick={handleDelete}>Delete</Button>
        </OrderInfoItem>
      </OrderCardContainer>
    </>
  );
};

export default OrderHistoryAdminCard;
