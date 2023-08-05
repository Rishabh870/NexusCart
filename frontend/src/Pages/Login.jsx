import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "../Components/Header";
import { publicRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const LoginPageContainer = styled.div`
  height: 80vh;
  display: flex;
  justify-content: center;
  font-family: "Playfair Display", sans-serif !important;
  align-items: center;
`;
const Button = styled.button`
  width: 100%;
  background-color: black;
  color: white;
  border: 2px solid black;
  padding: 0.5rem 0;
  margin-top: 0.9rem;
  font-size: large;

  &:hover {
    color: black;
    background-color: white;
  }
`;
const Title = styled.p`
  font-size: 2.5rem;
  width: fit-content;
  border-bottom: 1px solid black;
`;

const LoginFormContainer = styled.div`
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  Form.Group {
    Form.Label {
      font-family: "Playfair Display", sans-serif !important;
      font-weight: bolder;
    }
    Form.Control {
      font-family: "Playfair Display", sans-serif !important;
    }
  }
`;

const LogoContainer = styled.div`
  width: 10rem;
  display: flex;
  align-content: center;
`;

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in (e.g., by checking the token in local storage)
    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
      // User is logged in, redirect to "/home"
      navigate("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.formEmail.value;
    const password = e.target.formPassword.value;

    try {
      const response = await publicRequest.post("/user/login", {
        email,
        password,
      });
      const { _id, token, fullName } = response.data;

      // Store the userId and token in local storage
      localStorage.setItem("userId", _id);
      localStorage.setItem("token", token);
      const firstName = fullName.split(" ")[0];
      localStorage.setItem("name", firstName);

      window.location.href = "/";
    } catch (error) {
      console.log(error);
      // Handle error cases, such as displaying an error message
    }
  };

  return (
    <>
      <Header />
      <LoginPageContainer>
        <Container>
          <Row className="justify-content-center">
            <Col>
              <LoginFormContainer className="mx-auto">
                <div>
                  <Title className="text-center fw-bolder mx-auto">Login</Title>
                </div>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mt-3" controlId="formEmail">
                    <Form.Label>Email address : </Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="formPassword">
                    <Form.Label>Password :</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                    />
                  </Form.Group>

                  {loading ? (
                    <Button>Loading</Button>
                  ) : (
                    <Button type="submit">Login</Button>
                  )}

                  <div className="mt-3 text-center">
                    <p className="mb-0">
                      Do Not Have an Account? <Link to="/signup">Sign Up</Link>
                    </p>
                  </div>
                </Form>
              </LoginFormContainer>
            </Col>
          </Row>
        </Container>
      </LoginPageContainer>
    </>
  );
};

export default Login;
