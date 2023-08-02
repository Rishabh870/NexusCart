import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const CardContainer = styled.div`
  display: flex;
  max-width: 400px;
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
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const BrandName = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Category = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

const Button = styled.button`
  background-color: transparent;
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

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CarouselContainer = styled.div`
  margin-right: 10px;
  width: fit-content;
`;
const SizeContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
  width: 17rem;
`;
const SizeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? '#000' : '#fff')};
  color: ${(props) => (props.selected ? '#fff' : '#000')};
`;
const ProductCardAdmin = (product) => {
  const [selectedSize, setSelectedSize] = React.useState('');
  console.log(product);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
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
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
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
          <div style={{ borderRadius: '30px' }}>
            <img
              src='https://i.pinimg.com/564x/6e/d5/46/6ed5466e9892d68b4642d095348a2864.jpg'
              alt=''
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ borderRadius: '30px' }}>
            <img
              src='https://i.pinimg.com/564x/6e/d5/46/6ed5466e9892d68b4642d095348a2864.jpg'
              alt=''
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Carousel>
      </CarouselContainer>
      <ProductInfo>
        <ProductName>Name</ProductName>
        <BrandName>Brand </BrandName>
        <Price>Price</Price>
        <Category>Category </Category>
        <SizeContainer>
          {sizes.map((size, index) => (
            <SizeButton
              key={index}
              selected={selectedSize === size}
              onClick={() => handleSizeSelection(size)}
            >
              {size}
            </SizeButton>
          ))}{' '}
        </SizeContainer>
      </ProductInfo>
      <ButtonsContainer>
        <Button>
          <FaEdit />
        </Button>
        <Button>
          <FaTrash />
        </Button>
      </ButtonsContainer>
    </CardContainer>
  );
};

export default ProductCardAdmin;
