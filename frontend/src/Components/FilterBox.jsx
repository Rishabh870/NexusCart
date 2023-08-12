import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

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
  font-family: "Josefin Sans Regular";
  margin-bottom: 0%;
`;
const Filterbox = ({
  id,
  label,
  headLabel,
  setSelectedFilters,
  selectedFilters,
  setUpdate,
  update,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const params = new URLSearchParams(window.location.search);

  // Get the values for 'brand' and 'category' from the URL query parameters
  const brandFilters = params.get("brand");
  const categoryFilters = params.get("category");

  useEffect(() => {
    // Get the search query parameters from the URL
    // Update the selectedFilters state based on the URL values

    setSelectedFilters({
      brand: brandFilters ? brandFilters.split(",") : [],
      category: categoryFilters ? categoryFilters.split(",") : [],
    });
  }, [setSelectedFilters, brandFilters, categoryFilters]);

  useEffect(() => {
    if (headLabel === "category") {
      setIsChecked(selectedFilters?.category.includes(label));
    }
  }, [selectedFilters, headLabel, label]);

  useEffect(() => {
    if (headLabel === "brand") {
      setIsChecked(selectedFilters?.brand.includes(label));
    }
  }, [selectedFilters, headLabel, label]);
  const onChange = (e) => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    setIsChecked(e.target.checked);
    setUpdate(!update);
    const filterValue = label;
    const existingFilters = searchParams.get(headLabel) || "";
    const filtersArray = existingFilters.split(",").filter(Boolean);
    if (e.target.checked) {
      filtersArray.push(filterValue);
    } else {
      const i = filtersArray.indexOf(filterValue);
      if (i !== -1) {
        filtersArray.splice(i, 1);
      }
    }
    searchParams.set(headLabel, filtersArray.join(","));
    // Remove the parent label if all filters for that label are deselected
    if (filtersArray.length === 0) {
      searchParams.delete(headLabel);
    }
    currentUrl.search = searchParams.toString();
    window.history.pushState({ path: currentUrl.href }, "", currentUrl.href);
  };
  return (
    <Checkbox>
      <input type="checkbox" id={id} checked={isChecked} onChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
    </Checkbox>
  );
};

export default Filterbox;
