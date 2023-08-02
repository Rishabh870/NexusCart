import React from 'react';
import ProductCardAdmin from '../AdminComponents/ProductCardAdmin';

const AdminProductPage = () => {
  const products = [
    {
      id: 1,
      productName: 'Shirt 1',
      brandName: 'Brand 1',
      price: 19.99,
      category: 'Clothing',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      id: 2,
      productName: 'Shirt 2',
      brandName: 'Brand 2',
      price: 24.99,
      category: 'Clothing',
      sizes: ['S', 'M', 'L', 'XL'],
    },
  ];
  return (
    <div>
      {products.map((product) => {})}
      <ProductCardAdmin />
    </div>
  );
};

export default AdminProductPage;
