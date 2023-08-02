import React, { useEffect, useState } from 'react';
import ProductCardAdmin from '../AdminComponents/ProductCardAdmin';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Container } from 'react-bootstrap';
import { userRequest } from '../requestMethods';
import AddProductModal from '../AdminComponents/AddProductModal';
import { styled } from 'styled-components';

const HeadingWrapper = styled.div`
  flex: 1;
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
`;

const ButtonWrapper = styled.button`
  padding: 0.3rem 1rem;
  border: 1.5px solid black;
  background-color: transparent;
  &:hover {
    background-color: black;
    color: white;
  }
`;
const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowModal = (product) => {
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const params = {};
        const response = await userRequest.get('/product/products', {
          params,
        });
        console.log(params);

        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllProducts();
  }, []);
  return (
    <div>
      <Header />

      <Container fluid className='px-5 mx-auto' style={{ minHeight: '40vh' }}>
        <div className='d-flex justify-content-between mb-4'>
          <HeadingWrapper>Products</HeadingWrapper>
          <ButtonWrapper onClick={handleShowModal}>
            Add Product
          </ButtonWrapper>{' '}
        </div>
        <div className='row' style={{ width: '100%' }}>
          {products.map((product) => (
            <div className='col-6 col-xl-4 mb-3'>
              <ProductCardAdmin key={product.id} product={product} />
            </div>
          ))}
        </div>
      </Container>
      <Footer />
      <AddProductModal show={showModal} onHide={handleCloseModal} />
    </div>
  );
};

export default AdminProductPage;
