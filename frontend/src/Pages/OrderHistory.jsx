import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "react-bootstrap";
import OrderCard from "../Components/OrderHistoryCard";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

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
  const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage
  const [loading, setLoading] = useState(false);

  const getUserOrders = async () => {
    try {
      const response = await userRequest.get(`order/orders/${userId}`);
      const ordersData = response.data;
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.error);
      setLoading(false);
      // Handle the error
    }
  };

  useEffect(() => {
    setLoading(true);

    getUserOrders();
  }, []);

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
        <Container>
          <OrderHistoryTitle>Order History</OrderHistoryTitle>
          <OrderDetailsContainer className="row">
            <Heading className="col-md-4">Order ID</Heading>
            <Heading className="col-md-2">Date</Heading>
            <Heading className="col-md-1">Total</Heading>
            <Heading className="col-md-2">Paid</Heading>
            <Heading className="col-md-1">Delivery</Heading>
            <Heading className="col-md-2">Item Details</Heading>
          </OrderDetailsContainer>
          <hr className="mb-2" />
          <ScrollableContainer>
            {orders.map((order) => (
              <div>
                <OrderCard
                  key={order._id}
                  orderId={order._id}
                  date={order.date}
                  total={order.total}
                  paid={order.paid}
                  delivery={order.delivery}
                  itemDetails={"click"}
                />
              </div>
            ))}
          </ScrollableContainer>
        </Container>
      )}
      <Footer />
    </>
  );
};

export default OrderHistory;
