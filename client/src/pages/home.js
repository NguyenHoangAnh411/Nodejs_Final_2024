import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Home.css';
import Navbar from '../components/navbar';
import ProductCard from '../components/ProductCard';

function Home() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopResponse = await axios.get('http://localhost:5000/api/shops/getallshops');
        setShops(shopResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <header className="home-header">
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Explore our wide range of products!</p>
      </header>

      <div className="shop-list">
        {shops.length === 0 ? (
          <p>Loading shops...</p>
        ) : (
          shops
            .filter((shop) => shop.products.length > 0)
            .map((shop) => (
              <div key={shop._id} className="shop-item">
                <h3>Shop: {shop.name}</h3>
                <div className="product-list">
                  {shop.products.map((productId) => (
                    <ProductCard key={productId} productId={productId} shopId={shop._id} />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Home;
