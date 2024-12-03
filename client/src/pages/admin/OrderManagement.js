import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrderById, getOrderDetails } from '../../hooks/orderApi';
import Sidebar from '../../components/Sidebar';
import '../../css/AdminPage.css';
import '../../css/OrderManagement.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderList = await getOrders({ filter, timeFilter, startDate, endDate });
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [filter, timeFilter, startDate, endDate]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
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

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <h1>Order Management</h1>

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select onChange={(e) => setTimeFilter(e.target.value)} value={timeFilter}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
        </select>

        {timeFilter === 'custom' && (
          <div>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
            />
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
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
                <td>${order.totalAmount}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
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
                  {product.productName} - ${product.price} x {product.quantity}
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
