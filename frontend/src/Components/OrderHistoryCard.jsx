import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const OrderCardContainer = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const OrderTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  font-family: "Josefin Sans regular";
`;

const OrderInfoItem = styled.div`
  margin-bottom: 5px;
  font-family: "Josefin Sans regular";
  text-align: center;
`;

const OrderCard = ({ orderId, date, total, paid, delivery, itemDetails }) => {
  const formattedDate = date.split("T")[0]; // Extract the date portion

  return (
    <OrderCardContainer className="row">
      <OrderTitle className="col-md-4 text-center">{orderId}</OrderTitle>
      <OrderInfoItem className="col-md-2"> {formattedDate}</OrderInfoItem>
      <OrderInfoItem className="col-md-1"> ${total}</OrderInfoItem>
      <OrderInfoItem className="col-md-2"> {paid}</OrderInfoItem>
      <OrderInfoItem className="col-md-1"> {delivery}</OrderInfoItem>
      <OrderInfoItem className="col-md-2">
        <Link to={`/order/${orderId}`}>Details</Link>
      </OrderInfoItem>
    </OrderCardContainer>
  );
};

export default OrderCard;
