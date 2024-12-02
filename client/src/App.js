import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/profile';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import GuestCheckoutPage from './pages/GuestCheckoutPage';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminPage from './pages/admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import SearchPage from './pages/SearchPage';
import Navbar from './components/Navbar';
import CouponManagementPage from './pages/admin/CouponManagementPage';
import OrderHistoryPage from './pages/OrderHistory';
import ManageProduct from './pages/admin/ManageProduct';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWithNavBar />
      </Router>
    </AuthProvider>
  );
}

function AppWithNavBar() {
  const location = useLocation();

  return (
    <div className="app">
      {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/admin-page" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/category-management" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
        <Route path="/coupon-management" element={<ProtectedRoute><CouponManagementPage /></ProtectedRoute>} />
        <Route path="/products-management" element={<ProtectedRoute><ManageProduct /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
