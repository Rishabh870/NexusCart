import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StyledImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const Title = styled.h2`
  font-family: 'Josefin Sans regular';
`;

const BrandSection = ({ brandData }) => {
  const images = brandData[0].DealData.map((deal) => deal.src);

  return (
    <div>
      <Title>Brands</Title>
      <div className='row'>
        <ImageContainer className='w-100 mt-4'>
          {images.map((image, index) => (
            <div
              className='col-md-2 p-0 m-0 d-flex justify-content-center'
              key={index}
            >
              <StyledImage src={image} alt={`Brand ${index + 1}`} />
            </div>
          ))}
        </ImageContainer>
      </div>
    </div>
  );
};

export default BrandSection;
