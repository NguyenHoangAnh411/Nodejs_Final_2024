import React, { useState } from 'react';
import { createCategory } from '../hooks/categoryApi';

const CreateCategoryForm = ({ onCategoryCreated }) => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const createdCategory = await createCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      onCategoryCreated(createdCategory);
    } catch (error) {
      setError('Error creating category. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCategorySubmit} className="create-category-form">
      <h2>Create New Category</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Enter category name"
          required
        />
      </div>
      <div>
        <label htmlFor="description">Category Description</label>
        <input
          type="text"
          id="description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          placeholder="Enter category description"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default CreateCategoryForm;
