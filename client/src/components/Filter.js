import React from 'react';
import '../css/Filter.css'

function Filter({ selectedPriceRange, handlePriceRangeChange }) {
  return (
    <div className="filter-section">
      <div>
        <h4>Lọc theo giá</h4>
        <label>
          <input
            type="radio"
            name="price-range"
            checked={selectedPriceRange && selectedPriceRange[0] === 0 && selectedPriceRange[1] === 1000}
            onChange={() => handlePriceRangeChange([0, 1000])}
          /> 0 - 1000
        </label>
        <label>
          <input
            type="radio"
            name="price-range"
            checked={selectedPriceRange && selectedPriceRange[0] === 1000 && selectedPriceRange[1] === 5000}
            onChange={() => handlePriceRangeChange([1000, 5000])}
          /> 1000 - 5000
        </label>
        <label>
          <input
            type="radio"
            name="price-range"
            checked={selectedPriceRange && selectedPriceRange[0] === 5000 && selectedPriceRange[1] === 10000}
            onChange={() => handlePriceRangeChange([5000, 10000])}
          /> 5000 - 10000
        </label>
        <label>
          <input
            type="radio"
            name="price-range"
            checked={selectedPriceRange && selectedPriceRange[0] === 10000 && selectedPriceRange[1] === Infinity}
            onChange={() => handlePriceRangeChange([10000, Infinity])}
          /> 10000+
        </label>
      </div>
    </div>
  );
}

export default Filter;
