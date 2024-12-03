import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, getAllProduct, getProductById } from '../../hooks/productApi'; 
import '../../css/ManageProduct.css'; 
import Sidebar from '../../components/Sidebar';

function ManageProduct() {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    cost: '',
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
            cost: result.cost,
            description: result.description,
            category: result.category,
            brand: result.brand,
            stock: result.stock,
            color: result.color,
            images: [], // Reset images when editing product
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

    // Append images to FormData
    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append('images', newProduct.images[i]);
    }

    // Log FormData content
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      let result;
      if (productId) {
        // Update existing product
        result = await updateProduct(productId, formData);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, ...newProduct } : product
          )
        );
        setMessage('Sản phẩm đã được cập nhật thành công!');
      } else {
        // Add new product
        result = await addProduct(formData);
        setProducts((prev) => [...prev, result]);
        setMessage('Sản phẩm đã được thêm thành công!');
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

      // Reset form after submission
      setNewProduct({
        name: '',
        price: '',
        cost: '',
        description: '',
        category: '',
        brand: '',
        stock: '',
        color: '',
        images: [],
      });
      setProductId(''); // Reset productId for new product
    } catch (error) {
      console.error('Lỗi khi xử lý sản phẩm:', error.message);
      setMessage('Có lỗi xảy ra khi xử lý sản phẩm!');
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id)); // Remove product from list
    } catch (error) {
      console.error('Lỗi khi xoá sản phẩm:', error.message);
    }
  };

  // Handle cancel (clear form)
  const handleCancel = () => {
    setNewProduct({
      name: '',
      price: '',
      cost: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      color: '',
      images: [],
    });
    setProductId(''); // Reset productId when cancel editing
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
          Giá bán:
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            className="input-field"
          />
        </label>
        <label>
          Giá nhập:
          <input
            type="number"
            name="cost"
            value={newProduct.cost}
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
