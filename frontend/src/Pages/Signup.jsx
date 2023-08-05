import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "../Components/Header";
import { publicRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SignupPageContainer = styled.div`
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

const SignupFormContainer = styled.div`
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

const Signup = () => {
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
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullName = e.target.formFullName.value;
    const email = e.target.formEmail.value;
    const mobileNumber = e.target.formMobileNumber.value;
    const password = e.target.formPassword.value;

    console.log(fullName);

    // Check if any field is empty
    if (!fullName || !email || !mobileNumber || !password) {
      // Highlight empty fields in red
      if (!fullName) {
        e.target.formFullName.classList.add("invalid-field");
      } else {
        e.target.formFullName.classList.remove("invalid-field");
      }
      if (!email) {
        e.target.formEmail.classList.add("invalid-field");
      } else {
        e.target.formEmail.classList.remove("invalid-field");
      }
      if (!mobileNumber) {
        e.target.formMobileNumber.classList.add("invalid-field");
      } else {
        e.target.formMobileNumber.classList.remove("invalid-field");
      }
      if (!password) {
        e.target.formPassword.classList.add("invalid-field");
      } else {
        e.target.formPassword.classList.remove("invalid-field");
      }
      return; // Stop form submission if any field is empty
    }

    // Clear any previous invalid field styling
    const formFields = e.target.elements;
    for (let i = 0; i < formFields.length; i++) {
      formFields[i].classList.remove("invalid-field");
    }

    try {
      const response = await publicRequest.post("/user/signup", {
        fullName,
        email,
        mobileNumber,
        password,
      });

      console.log(response.data);
      const { _id, token, name } = response.data;

      // Store the userId and token in local storage
      localStorage.setItem("userId", _id);
      localStorage.setItem("token", token);
      const firstName = name.split(" ")[0];
      localStorage.setItem("name", firstName);

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // User already exists, display a prompt
        alert("User already exists. Please log in instead.");
      } else {
        console.log(error);
        // Handle other error cases, such as displaying an error message
      }
    }
  };

  return (
    <>
      <Header />
      <SignupPageContainer>
        <Container>
          <Row className="justify-content-center">
            <Col>
              <SignupFormContainer className="mx-auto">
                <div>
                  <Title className="text-center fw-bolder mx-auto">
                    Sign Up
                  </Title>
                </div>
                <Form onSubmit={handleSignup}>
                  <Form.Group className="mt-3" controlId="formFullName">
                    <Form.Label>Full Name:</Form.Label>
                    <Form.Control type="text" placeholder="Enter full name" />
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="formEmail">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="formMobileNumber">
                    <Form.Label>Mobile Number:</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter mobile number"
                    />
                  </Form.Group>

                  <Form.Group className="mt-3" controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                    />
                  </Form.Group>

                  {loading ? (
                    <Button>Loading</Button>
                  ) : (
                    <Button type="submit">Sign Up</Button>
                  )}

                  <div className="mt-3 text-center">
                    <p className="mb-0">
                      Already have an account? <Link to="/login">Login</Link>
                    </p>
                  </div>
                </Form>
              </SignupFormContainer>
            </Col>
          </Row>
        </Container>
      </SignupPageContainer>
    </>
  );
};

export default Signup;
