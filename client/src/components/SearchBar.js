import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/category/search', {
          params: { query: query, page: 1, limit: 10 },
        });
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
