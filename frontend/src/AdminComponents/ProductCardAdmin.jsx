import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { userRequest } from '../requestMethods';

const CardContainer = styled.div`
  display: flex;
  position: relative;
  max-width: 420px;
  min-width: 250px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 14px;
  margin-bottom: 5px;
`;

const BrandName = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
  color: lightgray;
  font-size: 16px;
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Category = styled.p`
  font-size: 14px;
  color: lightgray;
  margin-bottom: 5px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  right: 0%;
`;

const Button = styled.button`
  background-color: transparent;
  position: relative;
  padding: 5px 10px;
  margin-right: 5px;
  height: fit-content;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselContainer = styled.div`
  margin-right: 10px;
  width: 120px;
`;

const SizeContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
  justify-content: space-between;
  width: 12rem;
`;

const SizeButton = styled.div`
  display: flex;
  font-size: small;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  color: '#000';
`;

const ProductCardAdmin = ({ product }) => {
  const editProduct = async () => {};
  const deleteProduct = async () => {
    try {
      const response = await userRequest.delete(`/product/${product._id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const responsive = {
    Laptop: {
      breakpoint: { max: 8000, min: 770 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 769, min: 0 },
      items: 1,
    },
  };
  return (
    <CardContainer className=''>
      <CarouselContainer>
        <Carousel
          swipeable={true}
          draggable={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          className=''
          transitionDuration={500}
          containerClass='carousel-container'
          removeArrowOnDeviceType={['Laptop', 'mobile']}
          itemClass='carousel-item-padding-40-px'
          showDots='true'
        >
          {product.img.map((src) => {
            return (
              <div style={{ borderRadius: '30px' }}>
                <img
                  src={src}
                  alt=''
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            );
          })}
        </Carousel>
      </CarouselContainer>
      <ProductInfo>
        <BrandName>{product.brandName} </BrandName>
        <ProductName>{product.productName}</ProductName>
        <Price>{product.price}</Price>
        <Category>
          {product.category[0]} {product.category[1]}{' '}
        </Category>
        <SizeContainer>
          {product.sizes.map((size, index) => (
            <SizeButton key={index}>{size}</SizeButton>
          ))}
        </SizeContainer>
      </ProductInfo>
      <ButtonsContainer>
        <Button onClick={editProduct}>
          <FaEdit />
        </Button>
        <Button onClick={deleteProduct}>
          <FaTrash />
        </Button>
      </ButtonsContainer>
    </CardContainer>
  );
};

export default ProductCardAdmin;
