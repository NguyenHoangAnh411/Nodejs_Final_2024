import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import ReactPaginate from 'react-paginate';
import { getAllProduct } from '../hooks/productApi';
import Filters from '../components/Filters';

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const productsPerPage = 20;

  const getPaginatedData = (page) => {
    const offset = (page - 1) * productsPerPage;
    return filteredProducts.slice(offset, offset + productsPerPage);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productList = await getAllProduct();
        setAllProducts(productList);
        setFilteredProducts(productList);
        setTotalPages(Math.ceil(productList.length / productsPerPage));
      } catch (error) {
        console.error('Lỗi khi lấy tất cả sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedPriceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPriceRange[0] &&
          product.price <= selectedPriceRange[1]
      );
    }

    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
  }, [selectedPriceRange, sortOrder, allProducts]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(selectedPriceRange === range ? null : range);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  if (loading) {
    return <Spinner />;
  }

  const paginatedProducts = getPaginatedData(currentPage);

  return (
    <div className="home">
      <div className="home-content">
        <div className="sidebar-container">
          <Sidebar
            selectedPriceRange={selectedPriceRange}
            handlePriceRangeChange={handlePriceRangeChange}
          />
        </div>

        <div className="main-content">
          <Filters
            sortOrder={sortOrder}
            handleSortOrderChange={handleSortOrderChange}
            selectedPriceRange={selectedPriceRange}
            handlePriceRangeChange={handlePriceRangeChange}
          />

          {/* Sản phẩm */}
          <div className="categories">
            {paginatedProducts.length > 0 ? (
              <div className="category-products">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    productId={product._id}
                    shopId={product.shop?._id || ''}
                  />
                ))}
              </div>
            ) : (
              <div>No Products</div>
            )}
          </div>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
