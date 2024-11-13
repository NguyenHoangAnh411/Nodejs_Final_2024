import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../css/SearchPage.css';
import Sidebar from '../components/Sidebar';

function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');  // Default sort by relevance
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, Infinity]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  const fetchProducts = useCallback(async () => {
    if (!query) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/api/category/search', {
        params: {
          query,
          page: 1,
          limit: 10,
          sortBy,  // Send sort criteria to the API
          minPrice: selectedPriceRange[0],
          maxPrice: selectedPriceRange[1],
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [query, sortBy, selectedPriceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value); // Update sortBy state when the user selects a sorting option
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);  // Update the price range filter
  };

  return (
    <div className="search-page">
      <div className="sidebar-container">
        <Sidebar 
          selectedPriceRange={selectedPriceRange}
          handlePriceRangeChange={handlePriceRangeChange}
        />
      </div>


      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {products.length === 0 && !loading && <div>No products found</div>}

    <div class="content">
      <div className="sort-options">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

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
                <p>Price: ${product.price}</p>
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
