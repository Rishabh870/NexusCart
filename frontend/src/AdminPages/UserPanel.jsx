import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { userRequest } from "../requestMethods";
import { Container } from "react-bootstrap";
import UserCard from "../AdminComponents/UserCard";
import { Modal, Button, Form } from "react-bootstrap";

const RowContainer = styled.div`
  padding: 10px 20px;
  background-color: #f8f9fa;
  font-weight: bold;
  font-family: "Playfair Display", sans-serif !important;
`;

const HeaderCell = styled.div`
  flex: 1;
  text-align: center;
`;

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await userRequest.get("/user/users/all");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [update]);

  return (
    <div>
      <Header />
      {loading ? (
        <div
          style={{ height: "80vh" }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container style={{ minHeight: "50rem" }}>
          <RowContainer className="row">
            <HeaderCell className="col-3">User ID</HeaderCell>
            <HeaderCell className="col-2">Name</HeaderCell>
            <HeaderCell className="col-3">Email</HeaderCell>
            <HeaderCell className="col-2">isAdmin</HeaderCell>
            <HeaderCell className="col-2 my-auto p-0">Action</HeaderCell>
          </RowContainer>

          {users.map((user, index) => {
            return (
              <div>
                <UserCard
                  userId={user._id}
                  name={user.fullName}
                  email={user.email}
                  isAdmin={user.isAdmin}
                  mobile={user.mobileNumber}
                  update={update}
                  setUpdate={setUpdate}
                />
              </div>
            );
          })}
        </Container>
      )}
      <Footer />
    </div>
  );
};

export default UserPanel;
