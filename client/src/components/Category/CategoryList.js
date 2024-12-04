import React from 'react';

const CategoryList = ({ categories }) => {
  if (categories.length === 0) return <p>No categories found.</p>;

  return (
    <div className="category-list">
      <h3>Existing Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <strong>{category.name}</strong>: {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
