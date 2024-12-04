import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SearchBar.css';
import { searchProducts } from '../hooks/productApi';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setLoading(true);
      try {
        const queryParams = { query: query, page: 1, limit: 10 };
        await searchProducts(queryParams);
        navigate(`/search?query=${query}`);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default SearchBar;
