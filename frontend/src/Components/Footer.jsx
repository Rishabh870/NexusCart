import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  font-family: "Josefin Sans regular";
  padding: 20px 0;
`;
const FooterText = styled.p`
  color: #333;
  margin: 0%;
  font-weight: bold;
`;

const Footer = () => {
  return (
    <>
      <hr className="mb-0" />
      <FooterContainer className="mt-0 mx-auto ">
        <Container className=" text-center ">
          <FooterText>&copy; 2023 E-Commerce. All Rights Reserved.</FooterText>
        </Container>
      </FooterContainer>
    </>
  );
};

export default Footer;
