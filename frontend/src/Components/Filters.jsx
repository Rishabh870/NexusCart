import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import filter from '../Data/filter.json';
import { publicRequest, userRequest } from '../requestMethods';
import { useLocation, useNavigate } from 'react-router-dom';
import Filterbox from './FilterBox';

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
  font-family: 'Josefin Sans Regular';
  font-weight: 600;
`;
const Heading = styled.h4`
  font-weight: 600;
  font-family: 'Playfair Display';
`;
const Btn = styled.span`
  font-weight: 600;
  color: red;
  font-family: 'Playfair Display', sans-serif;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  input {
    width: 15px;
    height: 15px;
  }
  &:checked + input::after {
    background-color: #000000; /* Change the color here */
  }
`;

const Label = styled.label`
  margin-left: 8px;
  font-family: 'Josefin Sans Regular';
  margin-bottom: 0%;
`;

const Filters = ({ setIsChecked, isChecked }) => {
  const [filters, setFilters] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const search = new URLSearchParams(location.search).get('searchQuery');

  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    category: [],
  });

  useEffect(() => {
    publicRequest
      .get('/category/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });

    // Fetch brands
    publicRequest
      .get('/brand/brands')
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleCheckboxChange = (e, checkBoxLabel, checkBoxFilterName) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    setIsChecked(!isChecked);
    if (e.target.checked) {
      // Checkbox is checked, add the value to the filtered array
      const existingFilters = searchParams.get(checkBoxFilterName) || '';
      const filterArray = existingFilters.split(',').filter(Boolean);
      filterArray.push(checkBoxLabel);
      searchParams.set(checkBoxFilterName, filterArray.join(','));
    } else {
      // Checkbox is unchecked, remove the value from the filtered array
      const existingFilters = searchParams.get(checkBoxFilterName) || '';
      const filterArray = existingFilters.split(',').filter(Boolean);
      const updatedFilterArray = filterArray.filter(
        (item) => item !== checkBoxLabel
      );
      searchParams.set(checkBoxFilterName, updatedFilterArray.join(','));
    }

    // Remove the query parameter if the resulting filtered array is empty
    const resultingFilters = searchParams.get(checkBoxFilterName);
    if (!resultingFilters) {
      searchParams.delete(checkBoxFilterName);
    }

    currentUrl.search = searchParams.toString();
    window.history.pushState({ path: currentUrl.href }, '', currentUrl.href);

    // Update the selectedFilters state after modifying the URL
    const newSelectedFilters = {
      ...selectedFilters,
      [checkBoxFilterName]:
        searchParams.get(checkBoxFilterName)?.split(',') || [],
    };
    setSelectedFilters(newSelectedFilters);
  };
  const handleClearAll = () => {
    setSelectedFilters({
      brand: [],
      category: [],
      color: [],
    });
    // Uncheck all the checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    navigate('/allproducts');
  };

  useEffect(() => {
    // Get the search query parameters from the URL
    const params = new URLSearchParams(location.search);

    // Get the values for 'brand' and 'category' from the URL query parameters
    const brandFilters = params.get('brand');
    const categoryFilters = params.get('category');

    // Update the selectedFilters state based on the URL values
    setSelectedFilters({
      brand: brandFilters ? brandFilters.split(',') : [],
      category: categoryFilters ? categoryFilters.split(',') : [],
    });
  }, [location.search]);

  return (
    <div className='' style={{ maxWidth: '300px', overflow: 'none' }}>
      <Top className='px-2'>
        <Heading>Filter</Heading>
        <Btn onClick={handleClearAll}>Clear All</Btn>
      </Top>
      <Bottom>
        <hr className='mb-3 mt-1' />
        <Title>
          <Header>Categories</Header>
          <Container className='ml-2'>
            {categories.map((checkbox, index) => (
              <Filterbox
                key={index}
                id={checkbox.id}
                label={checkbox.name}
                checked={selectedFilters.category.includes(checkbox.name)}
                onChange={(e) => {
                  handleCheckboxChange(e, checkbox.name, 'category');
                }}
              />
            ))}
          </Container>
        </Title>

        <hr className='my-3' />

        <Title>
          <Header>Brand</Header>
          <Container className='ml-2'>
            {brands.map((checkbox, index) => (
              <Filterbox
                key={index}
                id={checkbox.id}
                label={checkbox.name}
                checked={selectedFilters.brand.includes(checkbox.name)}
                onChange={(e) =>
                  handleCheckboxChange(e, checkbox.name, 'brand')
                }
              />
            ))}
          </Container>
        </Title>
      </Bottom>
    </div>
  );
};

export default Filters;
