import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px 0;
`;
const FooterText = styled.p`
  color: #333;
  font-weight: bold;
`;

const FooterLink = styled(Link)`
  color: #333;
  text-decoration: none;
  &:hover {
    color: #666;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 10px;
`;

const Footer = () => {
  return (
    <>
      <hr className='mb-0' />
      <FooterContainer className='mt-0 mx-auto '>
        <Container className='pt-4 pb-3'>
          <Row>
            <Col md={6} lg={3} className='pl-5'>
              <FooterText>Department</FooterText>
              <FooterList>
                <FooterListItem>
                  <FooterLink to='/'>Fashion</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Education Product</FooterLink>
                </FooterListItem>
                {/* Add more list items for each department */}
              </FooterList>
            </Col>
            <Col md={6} lg={3} className='pl-5'>
              <FooterText>About Us</FooterText>
              <FooterList>
                <FooterListItem>
                  <FooterLink to='/'>About Shopcart</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Careers</FooterLink>
                </FooterListItem>
                {/* Add more list items for each about section */}
              </FooterList>
            </Col>
            <Col md={6} lg={3} className='pl-5'>
              <FooterText>Service</FooterText>
              <FooterList>
                <FooterListItem>
                  <FooterLink to='/'>Shipping & Delivery</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Order Pickup</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Account Signup</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Account Signin</FooterLink>
                </FooterListItem>
              </FooterList>
            </Col>
            <Col md={6} lg={3} className='pl-5'>
              <FooterText>Help</FooterText>
              <FooterList>
                <FooterListItem>
                  <FooterLink to='/'>Shopcart Help</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink to='/'>Returns</FooterLink>
                </FooterListItem>
                {/* Add more list items for each help section */}
              </FooterList>
            </Col>
          </Row>
        </Container>
        <hr />
        <Container className=' text-center'>
          <FooterText>&copy; 2023 E-Commerce. All Rights Reserved.</FooterText>
        </Container>
      </FooterContainer>
    </>
  );
};

export default Footer;
