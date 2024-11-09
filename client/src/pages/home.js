import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Home.css';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';

function Home() {
  const [categories, setCategories] = useState({});
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:5000/api/category/home-products');
        setCategories(categoryResponse.data);

        const userId = localStorage.getItem('userId');
        if (userId) {
          const cartResponse = await axios.get(`http://localhost:5000/api/cart/${userId}`);
          setCart(cartResponse.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if ( loading) {
    return <Spinner />;
  }

  return (
    <div className="home">
      <Navbar />
      <Sidebar className="sidebar" />
      <div className="home-content">
        <div className="main-content">

          {loading ? (
            <Spinner />
          ) : (
            <div>

              <div className="categories">
                {Object.keys(categories).map((category) => (
                  categories[category].length > 0 && (
                    <div key={category} className="category-section">
                      <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                      <div className="category-products">
                        {categories[category].map((product, shop) => (
                          <ProductCard key={product._id} productId={product._id} shopId={product.shop._id}/>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
