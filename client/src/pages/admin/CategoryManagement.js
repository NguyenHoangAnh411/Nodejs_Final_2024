import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name) {
      setError('Category name is required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/products/categories', newCategory, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory({ name: '', description: '' });
      setError('');
    } catch (error) {
      setError('Error creating category: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Category Management</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={newCategory.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Category</button>
      </form>

      {error && <p>{error}</p>}

      <h2>Existing Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            {category.name} - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManagement;
