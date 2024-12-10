import React, { useState, useEffect } from 'react';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
} from '../../hooks/productApi';
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
        console.error('Error fetching product list:', error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching category list:', error.message);
      }
    };

    fetchProducts();
    fetchCategories();
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
          console.error('Error fetching product details:', error.message);
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
        formData.append(key, newProduct[key]);
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
        setMessage('Product updated successfully!');
      } else {
        const result = await addProduct(formData);
        setProducts((prev) => [...prev, result]);
        setMessage('Product added successfully!');
      }

      handleCancel();
    } catch (error) {
      console.error('Error handling product:', error.message);
      setMessage('An error occurred while handling the product.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      setMessage('Product deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error.message);
      setMessage('An error occurred while deleting the product.');
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
    <div
      className="manage-product-container"
      style={{ background: 'linear-gradient(to right, #f9f9f9, #ffffff)' }}
    >
      <Sidebar />
      <div className="content">
        <h1 style={{ color: '#4caf50' }}>Manage Products</h1>

        <form onSubmit={handleSubmitProduct} className="product-form">
          <h2>{productId ? 'Update Product' : 'Add New Product'}</h2>

          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              className="special-input"
              value={newProduct.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price (VND):</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cost:</label>
            <input
              type="number"
              name="cost"
              value={newProduct.cost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              required
            >
              <option value="">Choose Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Brand:</label>
            <input
              type="text"
              name="brand"
              className="special-input"
              value={newProduct.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Color:</label>
            <input
              type="text"
              name="color"
              className="special-input"
              value={newProduct.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Image:</label>
            <input type="file" multiple onChange={handleImageChange} />
            <div className="image-previews">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : productId ? 'Update' : 'Add Product'}
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>

        {message && <div className="message">{message}</div>}

        <h2 style={{ color: '#4caf50' }}>Product List</h2>
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <h3>{product.name}</h3>
              <p>Price: {product.price} VND</p>
              <p>Stock: {product.stock}</p>
              <div className="product-actions">
                <button
                  onClick={() => setProductId(product._id)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageProduct;
