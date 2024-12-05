import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, deleteProduct, getAllProduct, getProductById } from '../../hooks/productApi';
import { getAllCategories } from '../../hooks/categoryApi';
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
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProduct();
        setProducts(result);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        setCategories(result);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error.message);
      }
    };
    fetchCategories();
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
    const files = Array.from(e.target.files);
    setNewProduct((prevState) => ({
      ...prevState,
      images: files,
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (key !== 'images') {
        formData.append('price', newProduct.price * 25000); // Convert price to VND before saving
      }
    });

    for (let i = 0; i < newProduct.images.length; i++) {
      formData.append('images', newProduct.images[i]);
    }

    try {
      if (productId) {
        await updateProduct(productId, formData);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, ...newProduct } : product
          )
        );
        setMessage('Sản phẩm đã được cập nhật thành công!');
      } else {
        const result = await addProduct(formData);
        setProducts((prev) => [...prev, result]);
        setMessage('Sản phẩm đã được thêm thành công!');
      }

      handleCancel();
    } catch (error) {
      console.error('Lỗi khi xử lý sản phẩm:', error.message);
      setMessage('Có lỗi xảy ra khi xử lý sản phẩm!');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      setMessage('Sản phẩm đã được xóa!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.message);
      setMessage('Có lỗi xảy ra khi xóa sản phẩm!');
    }
  };

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
    setProductId('');
    setPreviewImages([]);
    setMessage('');
  };

  return (
    <div className="manage-product-container">
      <Sidebar />
      <div className="content">
        <h1>Product Management</h1>

        <form onSubmit={handleSubmitProduct} className="product-form">
          <h2>{productId ? 'Update Product' : 'Add New Product'}</h2>

          <label>
            Product Name:
            <input type="text" name="name" value={newProduct.name} onChange={handleChange} required />
          </label>
          <label>Price (VND):</label>
          <input type="number" name="price" value={newProduct.price} onChange={handleChange} />

          <label>
            Cost:
            <input type="number" name="cost" value={newProduct.cost} onChange={handleChange} required />
          </label>
          <label>
            Category:
            <select name="category" value={newProduct.category} onChange={handleChange} required>
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand:
            <input type="text" name="brand" value={newProduct.brand} onChange={handleChange} />
          </label>
          <label>
            Stock:
            <input type="number" name="stock" value={newProduct.stock} onChange={handleChange} required />
          </label>
          <label>
            Color:
            <input type="text" name="color" value={newProduct.color} onChange={handleChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={newProduct.description} onChange={handleChange}></textarea>
          </label>
          <label>
            Image:
            <input type="file" multiple onChange={handleImageChange} />
            <div className="image-previews">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} />
              ))}
            </div>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : productId ? 'Update' : 'Add Product'}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>

        {message && <div className="message">{message}</div>}

        <h2>Product List</h2>
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <h3>{product.name}</h3>
              <p>Price: $ {product.price}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => setProductId(product._id)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDeleteProduct(product._id)} className="delete-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageProduct;
