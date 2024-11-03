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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
