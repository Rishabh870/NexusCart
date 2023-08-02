import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Container } from 'react-bootstrap';
import { styled } from 'styled-components';
import { FaShoppingCart } from 'react-icons/fa';
import { BiSolidHeart } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {
  addCartProduct,
  addProduct,
  getCartProduct,
} from '../Redux/cartReducer';
import { publicRequest, userRequest } from '../requestMethods';
import { useParams } from 'react-router-dom';
import ReviewCard from '../Components/ReviewCard';
import ReviewForm from '../Components/ReviewForm';
import { MdOutlineStar } from 'react-icons/md';
const ProductInfo = styled.span``;
const Review = styled.div`
  margin-top: 2rem;
`;
const TopSection = styled.div``;
const BottomSection = styled.div``;
const SpecificationsList = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: small;
`;
const SpecificationItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0.2rem 0;
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
const Brand = styled.h5`
  font-weight: bold;
`;
const ProductName = styled.h6``;
const SizeHeader = styled.h6`
  font-weight: bold;
`;
const Price = styled.h4`
  margin-top: 1rem;
  span {
    font-weight: bold;
  }
`;
const ProductDetails = styled.h6`
  font-weight: bold;
`;
const ProductDetailsText = styled.p`
  font-size: small;
`;
const ReviewDetailsHeading = styled.p`
  font-size: medium;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 0.5rem 1.1rem;
  border-radius: 0.5rem;
  border: 2px solid black;
  width: 100%;
  background-color: black;
  color: white;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  &:hover {
    background-color: white;
    color: black;
  }
`;
const SignupBtn = styled.button`
  padding: 0.5rem 1.1rem;
  border-radius: 0.5rem;
  width: 100%;
  border: 2px solid black;
  background-color: white;
  color: black;
  margin: 0 0.5rem;
  margin-top: 0.5rem;
  &:hover {
    background-color: black;
    color: white;
  }
`;
const Icon = styled.span`
  font-size: large;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`;
const WishIcon = styled.span`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
`;

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  /* flex-direction: column; */
  align-items: center;
`;

const Star = styled(MdOutlineStar)`
  width: 3rem;
  height: 3rem;
`;
const RatingText = styled.p`
  margin-left: 8px;
  font-size: 16px;
  margin-bottom: 0%;
  color: #333;
`;
const Divider = styled.div`
  width: 1px;
  height: 50px;
  background-color: #ccc;
  margin: 0 1.5rem;
`;

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const remainingStar = 5 - filledStars;

  return (
    <StarContainer>
      <div>
        {[...Array(filledStars)].map((_, index) => (
          <Star key={index} size={20} color='#ffc107' />
        ))}
        {[...Array(remainingStar)].map((_, index) => (
          <Star key={index} size={20} color='#ccc' />
        ))}
      </div>
      <RatingText>{rating}</RatingText>
    </StarContainer>
  );
};

const ProductReview = ({ review }) => {
  return (
    <StarContainer>
      <Star size={20} color='#ffc107' />
      <RatingText>{review}</RatingText>
    </StarContainer>
  );
};

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await userRequest.get(`/product/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, []);

  const [cartItemCount, setCartItemCount] = useState(0);

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
  const [selectedSize, setSelectedSize] = useState('S');
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(
      addCartProduct({
        products: [
          { productId: productId, quantity: 1, selectedSize: selectedSize },
        ],
      })
    );
    console.log(product);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Header count={cartItemCount} />
      <Container>
        <ProductInfo className='row'>
          <div id='left' className='col'>
            <div
              className='mx-auto'
              style={{
                maxWidth: '400px',
                height: '100%',
              }}
            >
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
                {product.img.map((slide, index) => (
                  <div key={index} style={{ borderRadius: '30px' }}>
                    <img
                      src={slide}
                      alt={slide}
                      style={{ width: '100%', height: '610px' }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div id='right' className='col'>
            <TopSection>
              <Brand>{product.brandName}</Brand>
              <ProductName>{product.productName}</ProductName>
              <Price>
                <span>$</span>
                {product.price}
              </Price>
              <p>(Incl. of all taxes)</p>
            </TopSection>
            <hr />
            <div>
              <div>
                <SizeHeader className='fw-bolder'>SELECT SIZE </SizeHeader>
                <SizeContainer>
                  {product.sizes.map((size, index) => (
                    <SizeButton
                      key={index}
                      selected={selectedSize === size}
                      onClick={() => handleSizeSelection(size)}
                    >
                      {size}
                    </SizeButton>
                  ))}
                </SizeContainer>
              </div>
              <div
                className=' d-flex justify-content-around mt-3'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {localStorage.getItem('token') ? (
                  <Button onClick={addToCart}>
                    <Icon>
                      <FaShoppingCart />
                    </Icon>
                    Add to Cart
                  </Button>
                ) : (
                  <>
                    <Button>
                      <Icon>
                        <FaShoppingCart />
                      </Icon>
                      Login
                    </Button>
                    <SignupBtn>
                      <WishIcon>
                        <BiSolidHeart />
                      </WishIcon>
                      Sign Up
                    </SignupBtn>
                  </>
                )}
              </div>
            </div>
            <hr />
            <BottomSection>
              <ReviewDetailsHeading>Product Rating</ReviewDetailsHeading>
              <div className='row m-0'>
                <StarRating
                  className=' col border-left'
                  rating={product.review}
                />
                <Divider />
                <ProductReview className='col' review={4} />
              </div>
              <hr />
              <ProductDetails>PRODUCT DETAILS:</ProductDetails>
              <ProductDetailsText>{product.desc}</ProductDetailsText>
            </BottomSection>
          </div>
        </ProductInfo>
        <Review>
          <ReviewForm />
        </Review>
      </Container>
      <Footer />
    </div>
  );
};

export default Product;
