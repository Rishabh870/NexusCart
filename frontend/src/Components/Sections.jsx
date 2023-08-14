import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import ProductCard from "./ProductCard";
import { publicRequest } from "../requestMethods";
import { Link, Navigate, useNavigate } from "react-router-dom";
const Section = styled.div`
  /* Add your styles here */
  @media (max-width: 768px) {
    /* Styles for screens up to 768px wide */
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    h2 {
      font-size: 1.5rem;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
    .p-2 {
      flex-basis: calc(50% - 1rem);
    }
    img {
      width: 100%;
      height: auto;
    }
  }
`;

const Title = styled.h3`
  font-family: "Playfair ", serif;
  text-decoration: underline;
`;

const DealsSection = ({ filter }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {};
    params.category = [filter];
    const getProducts = async () => {
      try {
        const response = await publicRequest.get("/product/products", {
          params,
        });

        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, [filter]);

  // Display the last 4 products from the products array
  const limitedProducts = products.slice(-4);
  return (
    <>
      <Section className="mt-4 mb-3">
        <Title>{filter}:</Title>
        <div className="row my-4">
          {limitedProducts.map((product, index) => (
            <div
              className="col-md-4 col-lg-3"
              key={index}
              style={{ borderRadius: "30px" }}
            >
              <Link
                to={`/product/${product._id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ProductCard product={product} />
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default DealsSection;
