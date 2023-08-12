import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { userRequest } from "../requestMethods";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const CardContainer = styled.div`
  text-align: center;
  padding: 10px 20px;
  font-family: "Josefin Sans", sans-serif;
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
  font-size: small;
  padding: 3px 12px;
  margin-right: 5px;
`;

const StyledButton = styled(Button)`
  background-color: black !important;
  border-color: #000000 !important;
  color: white;
  border-radius: 0%;
`;

const CloseButton = styled(Button)`
  background-color: white !important;
  border-color: black !important;
  color: black !important;
  margin-right: 5px;
  border-radius: 0%;
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
      const response = await userRequest.put(`/user/${userId}`, data);
      setUpdate(!update);
      toast.success("User Updated");
    } catch (error) {
      toast.error(error.response.data.error);
    }
    handleCloseModal(); // Close the modal after submitting the form
  };

  const handleDelete = async () => {
    try {
      const response = await userRequest.delete(`/user/users/${userId}`);
      setUpdate(!update);
      toast.success("User Deleted");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setFullName(name);
    setEmail(email);
    setIsAdmin(isAdmin);
    setMobileNumber(mobile);
  }, [showModal, isAdmin, mobile, name]);

  return (
    <CardContainer className="row">
      <UserInfo className="col-3 my-auto">{userId}</UserInfo>
      <UserInfo className="col-2 my-auto">{name}</UserInfo>
      <UserInfo className="col-3 my-auto">{editEmail}</UserInfo>
      <UserInfo className="col-2 my-auto">
        {editIsAdmin ? "Yes" : "No"}
      </UserInfo>
      <UserInfo className="col-2 my-auto p-0">
        <ActionButton onClick={handleShowModal} edit>
          Edit
        </ActionButton>
        <ActionButton onClick={handleDelete}>Delete</ActionButton>
      </UserInfo>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="fullName">
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Full Name"
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="email">
              <Form.Control
                type="email"
                value={editEmail}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="mobileNumber">
              <Form.Control
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="mobileNumber">
              <Form.Control
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter New Password"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={editIsAdmin}
                onChange={(e) => {
                  setIsAdmin(e.target.checked);
                }}
              />
            </Form.Group>

            <div className="d-flex  justify-content-between">
              <div></div>
              <div style={{ width: "fit-content" }}>
                <CloseButton onClick={handleCloseModal}>Close</CloseButton>
                <StyledButton type="submit">Submit</StyledButton>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </CardContainer>
  );
};

export default UserCard;
