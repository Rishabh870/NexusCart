import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { userRequest } from "../requestMethods";
import { Modal, Button, Form } from "react-bootstrap";
const CardContainer = styled.div`
  text-align: center;
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const ActionButton = styled.button`
  background-color: ${(props) => (props.edit ? "white" : "black")};
  color: ${(props) => (props.edit ? "black" : "white")};
  border: 2px solid black;
  cursor: pointer;
  padding: 3px 12px;
  margin-right: 5px;
`;

const UserCard = ({
  userId,
  name,
  email,
  isAdmin,
  mobile,
  update,
  setUpdate,
}) => {
  const [fullName, setFullName] = useState("");
  const [editEmail, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [editIsAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdate(!update);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        password,
        email: editEmail,
        isAdmin: editIsAdmin,
        fullName,
        mobileNumber,
      };
      console.log(data);
      const response = await userRequest.put(`/user/${userId}`, data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    handleCloseModal(); // Close the modal after submitting the form
  };

  const handleDelete = async () => {
    try {
      const response = await userRequest.delete(`/user/users/${userId}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFullName(name);
    setEmail(email);
    setIsAdmin(isAdmin);
    setMobileNumber(mobile);
  }, [showModal]);

  return (
    <CardContainer className="row">
      <UserInfo className="col-3 my-auto">{userId}</UserInfo>
      <UserInfo className="col-2 my-auto">{name}</UserInfo>
      <UserInfo className="col-2 my-auto">{email}</UserInfo>
      <UserInfo className="col-2 my-auto">{isAdmin ? "Yes" : "No"}</UserInfo>
      <UserInfo className="col-3 my-auto">
        <ActionButton onClick={handleShowModal} edit>
          Edit
        </ActionButton>
        <ActionButton onClick={handleDelete}>Delete</ActionButton>
      </UserInfo>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name"
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </Form.Group>

            <Form.Group controlId="mobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
              />
            </Form.Group>
            <Form.Group controlId="mobileNumber">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter New Password"
              />
            </Form.Group>

            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </CardContainer>
  );
};

export default UserCard;
