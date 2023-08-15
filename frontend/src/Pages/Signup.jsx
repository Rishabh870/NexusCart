import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "../Components/Header";
import { publicRequest, userRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPageContainer = styled.div`
  min-height: 80vh;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
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
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
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

  const handleVerifyEmailClick = async () => {
    if (emailValue === "") {
      return toast.error("Please enter your email");
    }
    setShowOtpField(true);
    try {
      const response = await userRequest.post("/user/send-verification-code", {
        email: emailValue,
      });
    } catch (error) {
      toast.success(error.response.data.error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!showOtpField) {
      return toast.error("Please verify your email");
    }
    setLoading(true);
    const fullName = e.target.formFullName.value;
    const email = e.target.formEmail.value;
    const mobileNumber = e.target.formMobileNumber.value;
    const password = e.target.formPassword.value;
    const otp = e.target.formOTP.value;

    // Check if any field is empty
    if (!fullName || !email || !mobileNumber || !password || !otp) {
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
        e.target.form.classList.add("invalid-field");
      } else {
        e.target.formPassword.classList.remove("invalid-field");
      }
      if (!otp) {
        e.target.formOTP.classList.add("invalid-field");
      } else {
        e.target.formOTP.classList.remove("invalid-field");
      }
      setLoading(false);
      return; // Stop form submission if any field is empty
    }

    // Clear any previous invalid field styling
    const formFields = e.target.elements;
    for (let i = 0; i < formFields.length; i++) {
      formFields[i].classList.remove("invalid-field");
    }
    try {
      const verify = await userRequest.post("/user/verify-otp", {
        email: email,
        otp: otp,
      });

      if (verify.status === 200) {
        const response = await publicRequest.post("/user/signup", {
          fullName,
          email,
          mobileNumber,
          password,
        });
        const { _id, token, name } = response.data;

        // Store the userId and token in local storage
        localStorage.setItem("userId", _id);
        localStorage.setItem("token", token);
        const firstName = name.split(" ")[0];
        localStorage.setItem("name", firstName);
        navigate("/");
      } else {
        toast.error(verify.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // User already exists, display a prompt
        toast.error("User already exists. Please log in instead.");
      } else {
        toast.error(error.response.data.error);

        // Handle other error cases, such as displaying an error message
      }
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
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
                    <div className="d-flex">
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={emailValue}
                        onChange={handleEmailChange}
                      />
                      {showOtpField ? null : (
                        <span
                          className="text-success ml-2 d-block mt-2 cursor-pointer"
                          onClick={handleVerifyEmailClick}
                        >
                          Verify
                        </span>
                      )}
                    </div>
                    {showOtpField ? (
                      <Form.Text className="text-success">
                        OTP sent to your email. Please enter it below.
                      </Form.Text>
                    ) : null}
                  </Form.Group>

                  {showOtpField && (
                    <Form.Group
                      className="mt-3"
                      style={{ fontFamily: "Playfair, serif" }}
                      controlId="formOTP"
                    >
                      <Form.Label>Enter OTP:</Form.Label>
                      <Form.Control
                        type="number"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        placeholder="Enter OTP"
                      />
                    </Form.Group>
                  )}

                  <Form.Group
                    style={{ fontFamily: "Playfair, serif" }}
                    className="mt-3"
                    controlId="formMobileNumber"
                  >
                    <Form.Label>Mobile Number:</Form.Label>
                    <Form.Control
                      type="number"
                      className="input-group"
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
                    <Button className="bg-dark text-white border-dark" disabled>
                      Loading
                    </Button>
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
