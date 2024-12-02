import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, getAllProduct, getProductById } from '../../hooks/productApi'; 
import '../../css/ManageProduct.css'; 
import Sidebar from '../../components/Sidebar';

function ManageProduct() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    color: '',
    images: [],
  });

  const [productId, setProductId] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProduct();
        setProducts(result);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const result = await getProductById(productId);
          setNewProduct({
            name: result.name,
            price: result.price,
            description: result.description,
            category: result.category,
            brand: result.brand,
            stock: result.stock,
            color: result.color,
            images: [],
          });
        } catch (error) {
          console.error('Lỗi khi lấy chi tiết sản phẩm:', error.message);
        }
      }
    };
    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prevState) => ({
      ...prevState,
      images: e.target.files,
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (key !== 'images') {
        formData.append(key, newProduct[key]);
      }
    });

    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append('images', newProduct.images[i]);
    }

    try {
      let result;
      if (productId) {
        // Cập nhật sản phẩm
        result = await updateProduct(productId, formData);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, ...newProduct } : product
          )
        );
        setMessage('Sản phẩm đã được cập nhật thành công!');
      } else {
        // Thêm sản phẩm mới
        result = await addProduct(formData);
        setProducts((prev) => [...prev, result]);
        setMessage('Sản phẩm đã được thêm thành công!');
      }

      // Xóa thông báo sau 3 giây
      setTimeout(() => setMessage(''), 3000);

      // Làm sạch form
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: '',
        brand: '',
        stock: '',
        color: '',
        images: [],
      });
      setProductId(''); // Reset productId để thêm sản phẩm mới
    } catch (error) {
      console.error('Lỗi khi xử lý sản phẩm:', error.message);
      setMessage('Có lỗi xảy ra khi xử lý sản phẩm!');
    }
  };

  // Gửi yêu cầu xoá sản phẩm
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id)); // Xoá sản phẩm khỏi danh sách
    } catch (error) {
      console.error('Lỗi khi xoá sản phẩm:', error.message);
    }
  };

  // Xử lý hủy bỏ (clear form)
  const handleCancel = () => {
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      color: '',
      images: [],
    });
    setProductId(''); // Reset productId khi hủy bỏ chỉnh sửa
    setMessage('');
  };

  return (
    <div className="manage-product-container">
      <h1>Quản lý sản phẩm</h1>

      <Sidebar />
      <form onSubmit={handleSubmitProduct} className="product-form">
        <h2>{productId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <label>
          Tên sản phẩm:
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Giá:
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Mô tả:
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Danh mục:
          <input
            type="text"
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Thương hiệu:
          <input
            type="text"
            name="brand"
            value={newProduct.brand}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Số lượng:
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Màu sắc:
          <input
            type="text"
            name="color"
            value={newProduct.color}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Hình ảnh:
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="input-field"
          />
        </label>
        <button type="submit" className="submit-button">
          {productId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </button>
        <button type="button" onClick={handleCancel} className="cancel-button">
          Hủy bỏ
        </button>
      </form>

      {message && <div className="message">{message}</div>}

      <h2>Danh sách sản phẩm</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.price} VNĐ</p>
            <button onClick={() => setProductId(product._id)} className="edit-button">
              Chỉnh sửa
            </button>
            <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProduct;
