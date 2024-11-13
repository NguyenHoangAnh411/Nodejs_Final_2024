import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Home.css';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import ReactPaginate from 'react-paginate';

function Home() {
  const [categories, setCategories] = useState({});  // Lưu trữ sản phẩm theo từng danh mục
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1);  // Tổng số trang
  const productsPerPage = 20;  // Số lượng sản phẩm hiển thị trên mỗi trang
  const [allProducts, setAllProducts] = useState([]);  // Lưu tất cả sản phẩm trong một mảng

  // Hàm phân trang sản phẩm
  const getPaginatedData = (page) => {
    const offset = (page - 1) * productsPerPage;
    return allProducts.slice(offset, offset + productsPerPage);  // Lấy sản phẩm theo trang
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:5000/api/category/home-products');
        const allCategoryProducts = categoryResponse.data;
        const productList = [];
        
        // Chuyển tất cả sản phẩm từ các danh mục thành một mảng duy nhất
        Object.keys(allCategoryProducts).forEach(category => {
          productList.push(...allCategoryProducts[category]);  // Kết hợp tất cả sản phẩm vào mảng
        });

        setAllProducts(productList);  // Lưu tất cả sản phẩm vào state
        setTotalPages(Math.ceil(productList.length / productsPerPage));  // Tính tổng số trang

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

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);  // Cập nhật trang hiện tại khi người dùng chọn trang mới
  };

  if (loading) {
    return <Spinner />;
  }

  const paginatedProducts = getPaginatedData(currentPage);  // Lấy dữ liệu sản phẩm cho trang hiện tại

  return (
    <div className="home">
      <Navbar />
      <Sidebar className="sidebar" />
      <div className="home-content">
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
              <div>Không có sản phẩm nào để hiển thị</div>
            )}
          </div>
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
  );
}

export default Home;
