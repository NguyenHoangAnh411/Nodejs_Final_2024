import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AdminPage.css';
import Sidebar from '../../components/Sidebar';
function AdminPage() {
  return (
    <div>
            <Sidebar />
      <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-links">
        <ul>
          <li>
            <Link to="/product-management">Manage Products</Link>
          </li>
          <li>
            <Link to="/category-management">Manage Categories</Link>
          </li>
          <li>
            <Link to="/coupon-management">Manage Coupons</Link>
          </li>
        </ul>
      </div>
    </div>
    </div>
    
  );
}

export default AdminPage;
