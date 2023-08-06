import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AllProducts from "./Pages/AllProductsPage";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import { Provider } from "react-redux";
import OrderHistory from "./Pages/OrderHistory";
import Profile from "./Pages/Profile";
import { useDispatch } from "react-redux";
import { addProduct, getCartProduct } from "./Redux/cartReducer";
import LoginPage from "./Pages/Login";
import Signup from "./Pages/Signup";
import Header from "./Components/Header";
import CartPreview from "./Pages/OrderScreen";
import Dashboard from "./AdminPages/Dashboard";
import AdminProductPage from "./AdminPages/AdminProductPage";
import UserPanel from "./AdminPages/UserPanel";
import OrderHistoryAdmin from "./AdminPages/OrderHistory";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCartProduct());
  }, [dispatch]);

  return (
    <Router className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/allproducts/" element={<AllProducts />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/order/:id" element={<CartPreview />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProductPage />} />
        <Route path="/admin/users" element={<UserPanel />} />
        <Route path="/admin/history" element={<OrderHistoryAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
