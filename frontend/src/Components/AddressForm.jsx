import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { userRequest } from "../requestMethods";
import { toast } from "react-toastify";

const FormLabel = styled.label`
  font-weight: bold;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0;
  background-color: transparent;
  border: none;
  color: #000;
`;

const CloseIcon = styled(MdClose)`
  font-size: 1.5rem;
  line-height: 1;
`;

const StyledButton = styled(Button)`
  background-color: black !important;
  border-color: #000000 !important;
  color: white;
  border-radius: 0%;
`;

const DeliveryScreen = ({ showModal, handleCloseModal, setUpdate, update }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const addressData = {
      fullName: formData.get("fullName"),
      mobileNumber: formData.get("mobileNumber"),
      pincode: formData.get("pincode"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2"),
      landmark: formData.get("landmark"),
      city: formData.get("city"),
      state: formData.get("state"),
    };

    // Check if any field is empty
    let isFormValid = true;

    for (let field of form.elements) {
      if (field.tagName === "INPUT" && field.value.trim() === "") {
        field.style.borderColor = "red";
        isFormValid = false;
      } else {
        field.style.borderColor = "";
      }
    }

    if (!isFormValid) {
      return;
    }

    try {
      const response = await userRequest.post(
        `/delivery/addaddress/${userId}`,
        addressData
      );
      // Handle the response data
      toast.success("Address added successfully");
      setUpdate(!update);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      // Handle the error
      toast.error(error.response.data.error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Change Address</Modal.Title>
        <CloseButton variant="link" onClick={handleCloseModal}>
          <CloseIcon>&times;</CloseIcon>
        </CloseButton>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group>
            <FormLabel>Full Name (First and Last Name)</FormLabel>
            <FormControl
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Pincode</FormLabel>
            <FormControl
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              autoComplete="postal-code"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Flat, House no., Building, Company, Apartment</FormLabel>
            <FormControl
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              autoComplete="address-line1"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Area, Street, Sector, Village</FormLabel>
            <FormControl
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              autoComplete="address-line2"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Landmark</FormLabel>
            <FormControl
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>Town/City</FormLabel>
            <FormControl
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              autoComplete="address-level2"
              required
            />
          </Form.Group>
          <Form.Group>
            <FormLabel>State</FormLabel>
            <FormControl
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              autoComplete="address-level1"
              required
            />
          </Form.Group>
          <StyledButton type="submit">Save Changes</StyledButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeliveryScreen;
