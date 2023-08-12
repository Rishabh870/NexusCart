import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import filter from "../Data/filter.json";
import { publicRequest, userRequest } from "../requestMethods";
import { useLocation, useNavigate } from "react-router-dom";
import Filterbox from "./FilterBox";

const Title = styled.div`
  padding: 0 10px;
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
const Bottom = styled.div``;
const Header = styled.h5`
  margin-bottom: 10px;
  font-family: "Josefin Sans Regular";
  font-weight: 600;
`;
const Heading = styled.h4`
  font-weight: 600;
  font-family: "Playfair Display";
`;
const Btn = styled.span`
  font-weight: 600;
  color: red;
  font-family: "Playfair Display", sans-serif;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Filters = ({ update, setUpdate }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    category: [],
  });

  useEffect(() => {
    const getData = async () => {
      await publicRequest
        .get("/category/categories")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });

      // Fetch brands
      await publicRequest
        .get("/brand/brands")
        .then((response) => {
          setBrands(response.data);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    };
    getData();
  }, [selectedFilters]);

  const handleClearAll = () => {
    setSelectedFilters({
      brand: [],
      category: [],
    });
    // Uncheck all the checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    setUpdate(selectedFilters);
    navigate("/allproducts");
  };

  return (
    <div className="" style={{ maxWidth: "300px", overflow: "none" }}>
      <Top className="px-2">
        <Heading>Filter</Heading>
        <Btn onClick={handleClearAll}>Clear All</Btn>
      </Top>
      <Bottom>
        <hr className="mb-3 mt-1" />
        <Title>
          <Header>Categories</Header>
          <Container className="ml-2">
            {categories.map((checkbox, index) => (
              <Filterbox
                key={index}
                id={checkbox.id}
                label={checkbox.name}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                headLabel={"category"}
                setUpdate={setUpdate}
                update={update}
              />
            ))}
          </Container>
        </Title>

        <hr className="my-3" />

        <Title>
          <Header>Brand</Header>
          <Container className="ml-2">
            {brands.map((checkbox, index) => (
              <Filterbox
                key={index}
                id={checkbox.id}
                label={checkbox.name}
                setSelectedFilters={setSelectedFilters}
                selectedFilters={selectedFilters}
                headLabel={"brand"}
                update={update}
                setUpdate={setUpdate}
              />
            ))}
          </Container>
        </Title>
      </Bottom>
    </div>
  );
};

export default Filters;
