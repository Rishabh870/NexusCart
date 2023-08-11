import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Form } from "react-bootstrap";
import Header from "../Components/Header";
import { publicRequest, userRequest } from "../requestMethods";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPageContainer = styled.div`
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
  font-size: 2rem;
  width: fit-content;
  border-bottom: 1px solid black;
`;

const ResetFormContainer = styled.div`
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
const PassReset = () => {
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!showOtpField) {
      return alert("Please verify your email");
    }
    setLoading(true);
    const email = e.target.formEmail.value;
    const password = e.target.formPassword.value;
    const otp = e.target.formOTP.value;
    try {
      if (!otp || !email || !password) {
        if (!email) {
          e.target.formEmail.classList.add("invalid-field");
        } else {
          e.target.formEmail.classList.remove("invalid-field");
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
        return;
      }
      const formFields = e.target.elements;
      for (let i = 0; i < formFields.length; i++) {
        formFields[i].classList.remove("invalid-field");
      }
      const verify = await userRequest.post("/user/verify-otp", {
        email: email,
        otp: otp,
      });

      if (verify.status === 200) {
        const data = {
          email,
          password,
        };
        const response = await userRequest.put("/user/updatePassword", data);
        toast.success("Password updated successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handleVerifyEmailClick = async () => {
    setShowOtpField(true);
    try {
      const response = await userRequest.post("/user/send-verification-code", {
        email: emailValue,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <ResetPageContainer>
        <Container>
          <Row className="justify-content-center">
            <Col>
              <ResetFormContainer className="mx-auto">
                <div>
                  <Title className="text-center fw-bolder mx-auto">
                    Reset Password
                  </Title>
                </div>
                <Form className="mt-4" onSubmit={handleReset}>
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
                    <Form.Group className="mt-3" controlId="formOTP">
                      <Form.Label>Enter OTP:</Form.Label>
                      <Form.Control
                        type="number"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        placeholder="Enter OTP"
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mt-3" controlId="formPassword">
                    <Form.Label>Password :</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                    />
                  </Form.Group>

                  {loading ? (
                    <Button disabled>Loading</Button>
                  ) : (
                    <Button type="submit">Reset</Button>
                  )}
                </Form>
              </ResetFormContainer>
            </Col>
          </Row>
        </Container>
      </ResetPageContainer>
    </div>
  );
};

export default PassReset;
