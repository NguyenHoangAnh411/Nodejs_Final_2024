import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/ProductManagement.css'

function ProductManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/category/getcategories');
        console.log(response.data);
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/category/categories',
        newCategory,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      console.log(response.data); 
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="product-management">
      <h1>Product Management</h1>

      <div className="create-category-form">
        <h2>Create New Category</h2>
        <form onSubmit={handleCategorySubmit}>
          <div>
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Category name"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Category Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="Category description"
              required
            />
          </div>
          <button type="submit">Create Category</button>
        </form>
      </div>

      <h3>Existing Categories</h3>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <strong>{category.name}</strong>: {category.description}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default ProductManagement;
