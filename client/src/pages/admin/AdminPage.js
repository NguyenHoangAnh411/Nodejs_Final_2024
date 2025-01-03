import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AdminPage.css';
import Sidebar from '../../components/Sidebar';

function AdminPage() {
  return (
    <div id="admin-dashboard">
      <Sidebar />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>

        <div className="admin-links">
          <ul>
            <li>
              <Link to="/category-management">Manage Categories</Link>
            </li>
            <li>
              <Link to="/coupon-management">Manage Coupons</Link>
            </li>
            <li>
              <Link to="/products-management">Manage Products</Link>
            </li>
            <li>
              <Link to="/user-management">Manage Users</Link>
            </li>
            <li>
              <Link to="/order-management">Manage Orders</Link>
            </li>
            <li>
              <Link to="/reports">View Reports</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
