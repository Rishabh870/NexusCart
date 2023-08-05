import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeadlineSlider";
import { Container } from "react-bootstrap";
import Sections from "../Components/Sections";
import dealData from "../Data/home.json";
import BrandSection from "../Components/BrandSection";
import { useDispatch } from "react-redux";
import { getCartProduct } from "../Redux/cartReducer";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethods";

const Home = () => {
  const [section, setSection] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();

  if (location.state && location.state.from === "/login") {
    dispatch(getCartProduct());
  }
  useEffect(() => {
    const getCategorys = async () => {
      try {
        const categories = await userRequest.get("/category/categories");
        const latestCategories = categories.data
          .slice(-3)
          .map((category) => category.name);
        setSection(latestCategories);
      } catch (error) {
        console.error(error);
      }
    };

    getCategorys();
  }, []);
  return (
    <div>
      <Header />
      <Container className="mb-2">
        <HeroSection />
        {section.map((section) => (
          <Sections filter={section} />
        ))}
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
