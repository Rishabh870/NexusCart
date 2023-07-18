import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AllProducts from './Pages/AllProductsPage';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import { Provider } from 'react-redux';
import OrderHistory from './Pages/OrderHistory';
import Profile from './Pages/Profile';
import { useDispatch } from 'react-redux';
import { addProduct, getCartProduct } from './Redux/cartReducer';
import LoginPage from './Pages/Login';
import Signup from './Pages/Signup';
import Header from './Components/Header';
import CartPreview from './Pages/CartPreview';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCartProduct());
  }, [dispatch]);

  return (
    <Router className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/allproducts/' element={<AllProducts />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<OrderHistory />} />
        <Route path='/cartpreview' element={<CartPreview />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
