import React from 'react';
import { styled } from 'styled-components';

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
const Filterbox = ({ id, label, checked, onChange }) => {
  return (
    <Checkbox>
      <input type='checkbox' id={id} checked={checked} onChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
    </Checkbox>
  );
};

export default Filterbox;
