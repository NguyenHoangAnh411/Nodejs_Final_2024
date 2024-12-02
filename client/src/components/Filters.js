import React, { useState } from 'react';
import '../css/Filters.css';

const Filters = ({
  sortOrder,
  handleSortOrderChange,
  selectedPriceRange,
  handlePriceRangeChange,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const priceRanges = [
    [0, 100],
    [100, 500],
    [500, 1000],
    [1000, 5000],
    [5000, Infinity],
  ];
  
  return (
    <div className="filters">
      <div className="dropdown">
        <button
          className="filter-button"
          onClick={() => setIsSortOpen(!isSortOpen)}
        >
          Sắp xếp theo
        </button>
        {isSortOpen && (
          <div className="dropdown-menu">
            <button
              className={`dropdown-item ${sortOrder === 'newest' ? 'active' : ''}`}
              onClick={() => handleSortOrderChange('newest')}
            >
              Sản phẩm mới nhất
            </button>
            <button
              className={`dropdown-item ${sortOrder === 'oldest' ? 'active' : ''}`}
              onClick={() => handleSortOrderChange('oldest')}
            >
              Sản phẩm cũ nhất
            </button>
          </div>
        )}
      </div>

      <div className="dropdown">
        <button
          className="filter-button"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          Bộ lọc giá
        </button>
        {isPriceOpen && (
          <div className="dropdown-menu">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                className={`dropdown-item ${
                  selectedPriceRange === range ? 'active' : ''
                }`}
                onClick={() => handlePriceRangeChange(range)}
              >
                {range[0].toLocaleString()} - {range[1].toLocaleString()} $
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
