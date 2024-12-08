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
    [0, 2500000],       // 0 - 100 USD
    [2500000, 12500000], // 100 - 500 USD
    [12500000, 25000000], // 500 - 1000 USD
    [25000000, 125000000], // 1000 - 5000 USD
    [125000000, Infinity], // 5000+ USD
  ];

  // Format giá hiển thị
  const formatPriceRange = (range) =>
    `${range[0].toLocaleString('vi-VN')} - ${
      range[1] === Infinity ? '∞' : range[1].toLocaleString('vi-VN')
    } VND`;

  // Hiển thị văn bản cho nút sắp xếp
  const getSortLabel = () => {
    if (sortOrder === 'newest') return 'Sản phẩm mới nhất';
    if (sortOrder === 'oldest') return 'Sản phẩm cũ nhất';
    return 'Sắp xếp theo';
  };

  // Hiển thị văn bản cho bộ lọc giá
  const getPriceLabel = () => {
    if (!selectedPriceRange) return 'Bộ lọc giá';
    return formatPriceRange(selectedPriceRange);
  };

  return (
    <div className="filters">
      <div className="dropdown">
        <button
          className="filter-button"
          onClick={() => setIsSortOpen(!isSortOpen)}
        >
          {getSortLabel()}
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
          {getPriceLabel()}
        </button>
        {isPriceOpen && (
          <div className="dropdown-menu">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                className={`dropdown-item ${selectedPriceRange === range ? 'active' : ''}`}
                onClick={() => handlePriceRangeChange(range)}
              >
                {formatPriceRange(range)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
