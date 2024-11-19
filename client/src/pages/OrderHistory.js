import React, { useEffect, useState } from 'react';
import { getOrdersByUserId, updateOrderStatus } from '../hooks/orderApi';
import '../css/OrderHistory.css';
import Sidebar from '../components/Sidebar';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUserId();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const id = setInterval(fetchOrders, 5000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="order-history-page">
        <h1>Transaction History</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : orders.length > 0 ? (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      <p>Product: {item.productName}</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  ))}
                </ul>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <div>
                    <button onClick={() => handleUpdateStatus(order._id, 'Cancelled')}>Cancel Order</button>
                  </div>
                )}
                {order.status === 'Shipped' && (
                  <div>
                    <button onClick={() => handleUpdateStatus(order._id, 'Delivered')}>Mark as Delivered</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
