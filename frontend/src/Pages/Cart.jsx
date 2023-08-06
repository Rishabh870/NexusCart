import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styled from "styled-components";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import CartCard from "../Components/CartCard";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { userRequest } from "../requestMethods";
import AddressForm from "../Components/AddressForm";
import { useNavigate } from "react-router-dom";
const { vibrate } = navigator;

const Row = styled.div`
  display: flex;
  align-items: stretch;
  margin: 1rem;
`;

const ItemCart = styled.div`
  flex: 8;
`;

const Summary = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
`;
const Payment = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
`;

const Carts = styled.div`
  margin-bottom: 1rem;
`;

const CardHeader = styled.h1`
  font-size: 1.5rem;
  font-family: "Playfair ", serif;
  font-weight: bolder;
`;

const CardBody = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`;
const CartBody = styled.div`
  padding: 0.5rem;
  overflow: hidden;
  height: 500px;
  overflow-y: scroll;
`;

const SummaryDetails = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const SummaryTotal = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 0.5rem 0.9rem;
  background-color: black;
  color: white;
  border: 1px solid black;
  &:hover {
    background-color: white;
    color: black;
  }
`;

const DeliveryInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const DeliveryTo = styled.p`
  margin-bottom: 0;
  margin-top: 0.5rem;
  text-align: start;
  font-weight: bold;
  font-family: "Playfair Display", serif;
`;

const DeliveryAddress = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: start;
  font-family: "Josefin Sans", sans-serif;
  color: #888;
`;

const ChangeAddressButton = styled.button`
  padding: 5px 10px;
  width: 20%;
  color: white;
  background-color: #000000;
  border: 1px solid #000000;
  cursor: pointer;
  &:hover {
    color: #000000;
    background-color: white;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  /* border: 1px solid black; */
`;

const DropdownButton = styled.select`
  width: 100%;
  padding: 0.5rem 0.9rem;
  border: 1px solid black;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ::after {
    border: ${({ selected }) =>
      selected ? "1px solid black" : "1px solid red"};
  }
`;

const DropdownItem = styled.option`
  padding: 0.5rem 0.9rem;
  cursor: pointer;
`;

const Cart = () => {
  const [showModal, setShowModal] = useState(false);
  const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage

  const navigate = useNavigate();

  const cartProduct = useSelector((state) => state.cart.products);
  const [deliveryData, setDeliveryData] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await userRequest.get(`/delivery/address/${userId}`);
        setDeliveryData(response.data);
        // Handle the response data
      } catch (error) {
        console.log(error);
        // Handle the error
      }
      // console.log(deliveryData);
    };

    getUserData();
  }, []);

  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const formattedTotalPrice = totalPrice.toFixed(2);

  const [selectedMethod, setSelectedMethod] = useState("");

  const handleCheckout = async () => {
    if (selectedMethod === "") {
      return; // Stop the checkout process if the dropdown is not selected
    }

    try {
      console.log(cartProduct);
      const response = await userRequest.post(`/order/addorder/${userId}`, {
        userId,
        cartProduct,
        formattedTotalPrice,
        deliveryData,
      });
      // console.log(response.data.orders._id);
      const deleteProduct = await userRequest.delete(
        `/cart/products/${userId}`
      );
      window.location.href = `/order/${response.data.orders._id}`;
    } catch (error) {
      // Handle errors during the request
      console.log("Error during checkout:", error);
      // Show an error message to the user or perform other error handling logic
    }
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleAddressChange = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header />
      <Container className="cart text-center">
        <DeliveryInfoWrapper className="px-4">
          <div className=" w-100 ">
            <DeliveryTo>Delivery to: {deliveryData.deliveryTo}</DeliveryTo>
            <DeliveryAddress>
              Delivery Address: {deliveryData.deliveryAddress}
            </DeliveryAddress>
          </div>
          <ChangeAddressButton onClick={handleAddressChange}>
            Change Address
          </ChangeAddressButton>
        </DeliveryInfoWrapper>
        <Row className=" mx-0 row px-0">
          <ItemCart className="col-md-8 px-0 pr-2 col-12 m-lg-0">
            <Carts className="card">
              <CardHeader className="card-header">Cart</CardHeader>
              <CartBody className="card-body card-body-scroll p-2">
                {cartProduct.map((products, index) => {
                  return <CartCard key={index} data={products} show={true} />;
                })}
              </CartBody>
            </Carts>
          </ItemCart>

          <div className="col-sm-4 p-0">
            <Payment className="d-flex px-0 pl-2 col-12 flex-column m-lg-0 ">
              <Carts className="border">
                <CardHeader className="card-header">Payment Method</CardHeader>
                <CardBody className="card-body">
                  <DropdownWrapper>
                    <DropdownButton
                      selected={selectedMethod !== ""}
                      onChange={handleMethodSelect}
                      value={selectedMethod}
                    >
                      <option value="" disabled>
                        Select Payment Method
                      </option>
                      <DropdownItem value="Paypal">Paypal</DropdownItem>
                    </DropdownButton>
                  </DropdownWrapper>
                </CardBody>
              </Carts>
            </Payment>
            <Summary className="d-flex px-0 pl-2 col-12  flex-column m-lg-0 ">
              <Carts className="border">
                <CardHeader className="card-header">Summary</CardHeader>
                <CardBody className="card-body">
                  <SummaryDetails className="mb-3">
                    <span>Product price:</span>
                    <span className="float-end"> ${formattedTotalPrice}</span>
                  </SummaryDetails>
                  <SummaryDetails className="mb-3">
                    <span>Shipping:</span>
                    <span className="float-end">$5</span>
                  </SummaryDetails>
                  <SummaryDetails className="mb-3">
                    <span>Discount:</span>
                    <span className="float-end">-$5</span>
                  </SummaryDetails>
                  <SummaryTotal className="mb-3">
                    <span>Total:</span>
                    <span className="float-end">${formattedTotalPrice}</span>
                  </SummaryTotal>
                  <CheckoutButton
                    className="submitBtn btn-block"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </CheckoutButton>
                </CardBody>
              </Carts>
            </Summary>
          </div>
        </Row>
        <AddressForm
          showModal={showModal}
          handleCloseModal={handleCloseModal}
        />
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
