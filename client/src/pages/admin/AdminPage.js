import React from 'react';
import { Link } from 'react-router-dom';

function AdminPage() {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin! This page contains admin-specific content.</p>
      <div className="admin-links">
        <ul>
          <li>
            <Link to="/product-management">Manage Products</Link>
          </li>
          <li>
            <Link to="/category-management">Manage Categories</Link>
          </li>
          <li>
            <Link to="/other-admin-section">Other Admin Section</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
