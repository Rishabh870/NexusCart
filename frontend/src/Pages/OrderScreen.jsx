import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styled from "styled-components";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import CartCard from "../Components/CartCard";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { userRequest } from "../requestMethods";
import AddressForm from "../Components/AddressForm";
import { FaPaypal, FaCreditCard } from "react-icons/fa";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
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

  overflow-y: auto; /* Enable vertical scrolling */

  /* Scrollbar Styles */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #f8f9fa #dee2e6; /* Firefox */
  -ms-overflow-style: none; /* Hide scrollbar in IE and Edge */
  &::-webkit-scrollbar {
    width: 8px; /* Chrome, Safari, and Opera */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #adb5bd; /* Color of the thumb */
    border-radius: 4px; /* Border radius of the thumb */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #6c757d; /* Color of the thumb on hover */
  }
  &::-webkit-scrollbar-track {
    background-color: #dee2e6; /* Color of the track */
    border-radius: 4px; /* Border radius of the track */
    margin-right: -8px; /* Adjust for the border width */
  }
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
  font-family: "Playfair ", serif;
`;

const DeliveryAddress = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: start;
  font-family: "Josefin Sans", sans-serif;
  color: #888;
`;

const StatusData = styled.span`
  color: ${({ status }) => (status === "Yes" ? "green" : "red")};
  font-family: "Playfair ", serif;
  font-size: small;
`;
const Status = styled.span`
  font-family: "Playfair ", serif;
  color: black;
  font-size: medium;
`;

const Orderpreview = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [deliveryData, setDeliveryData] = useState("");
  const params = useParams();

  useEffect(() => {
    setLoading(true);
    const getUserData = async () => {
      try {
        const response = await userRequest.get(
          `/order/getorder/${params.id}/${userId}`
        );
        setDeliveryData(response.data);
        // Handle the response data
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.error);
        // Handle the error
      }
    };

    const loadPaypalScript = async () => {
      const { data: clientId } = await userRequest.get("/api/keys/paypal");

      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": clientId,
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: "pending",
      });
    };

    loadPaypalScript();
    getUserData();
  }, [paypalDispatch, params, userId, update]);

  const formattedTotalPrice = deliveryData?.total;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const createOrder = (data, action) => {
    return action.order
      .create({
        purchase_units: [
          {
            amount: { value: formattedTotalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, action) => {
    return action.order.capture().then(async (orders) => {
      try {
        const response = await userRequest.put(
          `/order/editorder/${params.id}/${userId}`
        );
        toast.success("Payment Successful!");
        setUpdate(!update);
      } catch (error) {
        toast.error(error.response.data.error);
      }
    });
  };
  const onError = (err) => {
    toast.error(err);
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
        <Container style={{ minHeight: "82vh" }} className="cart text-center">
          <DeliveryInfoWrapper className="px-4">
            <div className=" w-75 ">
              <DeliveryTo>
                Delivery to: {deliveryData.address?.deliveryTo}
              </DeliveryTo>
              <DeliveryAddress>
                Delivery Address: {deliveryData.address?.deliveryAddress}
              </DeliveryAddress>
            </div>
            <div className="w-25">
              <Status>Status: </Status>
              <StatusData status={deliveryData.paid}>
                {deliveryData.paid === "Yes" ? "Paid" : "Not Paid"},
              </StatusData>
              <StatusData status={deliveryData.delivery}>
                {" "}
                {deliveryData.delivery === "Yes"
                  ? "Delivered"
                  : "Not Delivered"}
              </StatusData>
            </div>
          </DeliveryInfoWrapper>
          <Row className=" mx-0 px-0">
            <ItemCart className="col-sm-8 px-0 pr-2 col-12 m-lg-0">
              <Carts className="card">
                <CardHeader className="card-header">Cart</CardHeader>
                <CartBody className="card-body card-body-scroll p-2">
                  {deliveryData.products?.map((products, index) => {
                    const { selectedSize, quantity, price } = products;
                    const product = products.productId;
                    const data = {
                      brandName: product.brandName,
                      category: product.category,
                      desc: product.desc,
                      img: product.img,
                      inStock: product.inStock,
                      price: price,
                      productName: product.productName,
                      quantity: quantity,
                      review: product.review,
                      selectedSize: selectedSize,
                      sizes: product.sizes,
                      _id: product._id,
                    };
                    return <CartCard key={index} data={data} show={false} />;
                  })}
                </CartBody>
              </Carts>
            </ItemCart>

            <div className="col-sm-4 p-0">
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
                    {deliveryData.paid === "Yes" ? null : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    )}
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
      )}
      <Footer />
    </>
  );
};

export default Orderpreview;
