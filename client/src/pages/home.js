import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Home.css';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import ReactPaginate from 'react-paginate';

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // Định nghĩa selectedPriceRange
  const productsPerPage = 20;

  // Hàm phân trang
  const getPaginatedData = (page) => {
    const offset = (page - 1) * productsPerPage;
    return filteredProducts.slice(offset, offset + productsPerPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:5000/api/category/home-products');
        const allCategoryProducts = categoryResponse.data;
        const productList = [];

        // Lấy tất cả sản phẩm từ các category
        Object.keys(allCategoryProducts).forEach(category => {
          productList.push(...allCategoryProducts[category]);
        });

        setAllProducts(productList);
        setFilteredProducts(productList);
        setTotalPages(Math.ceil(productList.length / productsPerPage));

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const matchesPrice = selectedPriceRange ? product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1] : true;
      return matchesPrice;
    });
  
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
  }, [selectedPriceRange, allProducts]);
  

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1); 
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(selectedPriceRange === range ? null : range);
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
          <div className="categories">
            {paginatedProducts.length > 0 ? (
              <div>
                <div className="category-products">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} productId={product._id} shopId={product.shop._id} />
                  ))}
                </div>
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
