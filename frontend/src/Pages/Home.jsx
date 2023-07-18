import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import HeroSection from '../Components/HeadlineSlider';
import { Container } from 'react-bootstrap';
import Sections from '../Components/Sections';
import dealData from '../Data/home.json';
import BrandSection from '../Components/BrandSection';
import { useDispatch } from 'react-redux';
import { getCartProduct } from '../Redux/cartReducer';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const section = ['Shirts', 'Skirts', 'Jeans'];

  const dispatch = useDispatch();
  const location = useLocation();

  if (location.state && location.state.from === '/login') {
    dispatch(getCartProduct());
  }

  return (
    <div>
      <Header />
      <Container className='mb-2'>
        <HeroSection />
        <Sections filter={section[0]} />
        <Sections filter={section[1]} />
        <Sections filter={section[2]} />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
