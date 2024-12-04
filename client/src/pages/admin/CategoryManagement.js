import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../hooks/categoryApi';
import Sidebar from '../../components/Sidebar';
import CreateCategoryForm from '../../modals/CreateCategoryForm';
import CategoryList from '../../components/Category/CategoryList';
import '../../css/CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleNewCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="category-management">
      <h1>Category Management</h1>
      <Sidebar />
      <CreateCategoryForm onCategoryCreated={handleNewCategory} />
      {loading ? <p>Loading categories...</p> : <CategoryList categories={categories} />}
    </div>
  );
};

export default CategoryManagement;
