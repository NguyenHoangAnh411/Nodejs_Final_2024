import React, { useState, useEffect, useMemo } from 'react';
import { getOrders, updateOrderStatus, deleteOrderById, getOrderDetails } from '../../hooks/orderApi';
import Sidebar from '../../components/Sidebar';
import '../../css/OrderManagement.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    filter: '',
    timeFilter: '',
    startDate: '',
    endDate: '',
  });

  const fetchOrders = useMemo(() => {
    return async () => {
      try {
        const orderList = await getOrders(filters);
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrderById(orderId);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order.');
      }
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <h1>Order Management</h1>

        <select name="filter" onChange={handleFilterChange} value={filters.filter}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select name="timeFilter" onChange={handleFilterChange} value={filters.timeFilter}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>

        {filters.timeFilter === 'custom' && (
          <div>
            <input
              type="date"
              name="startDate"
              onChange={handleFilterChange}
              value={filters.startDate}
            />
            <input
              type="date"
              name="endDate"
              onChange={handleFilterChange}
              value={filters.endDate}
            />
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId}</td>
                <td>{`${(order.totalAmount).toLocaleString('vi-VN')} VND`}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => viewOrderDetails(order._id)} className="action-button details">
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="action-button delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="order-details">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.userId}</p>
            <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
            <p><strong>Discount Applied:</strong> {selectedOrder.discount ? 'Yes' : 'No'}</p>
            <p><strong>Order Status:</strong> {selectedOrder.status}</p>
            <p><strong>Purchase Time:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>

            <h3>Products in this Order:</h3>
            <ul>
              {selectedOrder.items && selectedOrder.items.map((product) => (
                <li key={product.productId}>
                  {product.productName} - {`${(product.price).toLocaleString('vi-VN')} VND`} x {product.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
