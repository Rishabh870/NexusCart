import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeadlineSlider";
import { Container } from "react-bootstrap";
import Sections from "../Components/Sections";
import { useDispatch } from "react-redux";
import { getCartProduct } from "../Redux/cartReducer";
import { useLocation } from "react-router-dom";
import { userRequest } from "../requestMethods";

const Home = () => {
  const [section, setSection] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  if (location.state && location.state.from === "/login") {
    dispatch(getCartProduct());
  }
  useEffect(() => {
    setLoading(true);
    const getCategorys = async () => {
      try {
        const categories = await userRequest.get("/category/categories");
        const latestCategories = categories.data
          .slice(-3)
          .map((category) => category.name.toUpperCase());
        setSection(latestCategories);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getCategorys();
  }, []);

  return (
    <div>
      <Header />
      {loading ? (
        <div
          style={{ minHeight: "82vh" }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container style={{ minHeight: "82vh" }} className="mb-2">
          <HeroSection />
          {section.map((section, index) => (
            <Sections key={index} filter={section} />
          ))}
        </Container>
      )}
      <Footer />
    </div>
  );
};

export default Home;
