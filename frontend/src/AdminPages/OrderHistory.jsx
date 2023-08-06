import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import OrderCard from "../AdminComponents/OrderHistoryAdminCard";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { userRequest } from "../requestMethods";

const OrderHistoryTitle = styled.h2`
  font-family: "Playfair Display", sans-serif !important;
  text-decoration: underline;
  font-size: 29px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bolder;
`;

const Heading = styled.div`
  text-align: center;
`;
const OrderDetailsContainer = styled.div`
  display: flex;
  font-family: "Playfair ", serif;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 2.5rem;
  margin-bottom: 10px;
`;

const ScrollableContainer = styled.div`
  min-height: 72vh;
  max-height: 500px; /* Adjust this value as needed to fit the card elements */
  overflow-x: hidden; /* Hide horizontal scrollbar */
  overflow-y: auto; /* Enable vertical scrolling */
  scrollbar-width: none; /* Hide the default scrollbar for Firefox */
  -ms-overflow-style: none; /* Hide the default scrollbar for IE and Edge */
  ::-webkit-scrollbar {
    width: 0; /* Hide the default scrollbar for Chrome, Safari, and Opera */
  }
`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [update, setUpdate] = useState(false);
  const getUserOrders = async () => {
    try {
      const response = await userRequest.get(`order/orders`);
      const ordersData = response.data;
      console.log(ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.log(error);
      // Handle the error
    }
  };

  useEffect(() => {
    getUserOrders();
  }, [update]);

  return (
    <>
      <Header />
      <Container>
        <OrderHistoryTitle>Order History</OrderHistoryTitle>

        <OrderDetailsContainer className="row">
          <Heading className="col-3 p-0">Order ID</Heading>
          <Heading className="col-1 p-0">Name</Heading>
          <Heading className="col-2 p-0">Date</Heading>
          <Heading className="col-1 p-0">Total</Heading>
          <Heading className="col-1 p-0">Paid</Heading>
          <Heading className="col-1 p-0">Delivery</Heading>
          <Heading className="col-3 p-0">Item Details</Heading>
        </OrderDetailsContainer>
        <hr className="mb-2" />
        <ScrollableContainer>
          {orders.map((ordersArray) => {
            const userId = ordersArray.userId;
            return ordersArray.orders.map((order) => {
              return (
                <div>
                  <OrderCard
                    key={order._id}
                    orderId={order._id}
                    date={order.date}
                    total={order.total}
                    paid={order.paid}
                    delivery={order.delivery}
                    userId={userId}
                    update={update}
                    setUpdate={setUpdate}
                  />
                </div>
              );
            });
          })}
        </ScrollableContainer>
      </Container>
      <Footer />
    </>
  );
};

export default OrderHistory;
