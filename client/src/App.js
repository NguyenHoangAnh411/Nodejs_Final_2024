import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/profile';
import ViewShop from './pages/ViewShop';
import ShopDetail from './pages/shopDetail';
import CreateShop from './pages/createShop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import GuestCheckoutPage from './pages/GuestCheckoutPage';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminPage from './pages/admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-shops" element={<ViewShop />} />
          <Route path="/shop/:shopId" element={<ShopDetail />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/product/:productId/:shopId" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/guest-checkout" element={<GuestCheckoutPage />} />


          <Route path="/admin-page" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/product-management" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          <Route path="/category-management" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
