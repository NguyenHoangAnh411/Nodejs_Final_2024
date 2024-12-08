import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/SearchPage.css';
import Sidebar from '../components/Sidebar';
import { fetchProductsFromApi } from '../hooks/productApi'; // Import API function
import Filters from '../components/Filters';

function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [sortOrder, setSortOrder] = useState('newest');

  // Memoize the query params to avoid unnecessary re-fetches
  const queryParams = useMemo(() => ({
    query,
    page: 1,
    limit: 10,
    minPrice: selectedPriceRange ? selectedPriceRange[0] : 0, // Giá trị mặc định
    maxPrice: selectedPriceRange ? selectedPriceRange[1] : Infinity, // Giá trị mặc định
  }), [query, selectedPriceRange]);

  const fetchProducts = useCallback(async () => {
    if (!query) return;
  
    setLoading(true);
    setError(null);
  
    try {
      // Gọi API từ file categoryApi.js
      const products = await fetchProductsFromApi(queryParams);
      setProducts(products);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);
  

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range ? range : [0, Infinity]); // Giá trị mặc định
  };

  return (
    <div className="search-page">
      <div className="sidebar-container">
        <Sidebar 
          selectedPriceRange={selectedPriceRange}
          handlePriceRangeChange={handlePriceRangeChange}
        />
      </div>

      <div className="content">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {products.length === 0 && !loading && <div>No products found</div>}

        <Filters
          sortOrder={sortOrder}
          handleSortOrderChange={handleSortOrderChange}
          selectedPriceRange={selectedPriceRange}
          handlePriceRangeChange={handlePriceRangeChange}
        />

        {products.length > 0 && (
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.images.map((image, index) => (
                  <img key={index} src={image.url} alt={image.alt || product.name} />
                ))}
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Price: {`${(product.price).toLocaleString('vi-VN')} VND`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
