import React, { useState, useEffect } from 'react';
import '../css/CheckOutModal.css';
import { checkoutOrder } from '../hooks/orderApi';
import { updateProfile } from '../hooks/userApi';

const CheckoutModal = ({ isOpen, onClose, onConfirm, checkoutInfo, onChange, addresses, orderDetails }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0);
  const [totalAmount, setTotalAmount] = useState(orderDetails ? orderDetails.totalAmount : 0);
  const [newAddress, setNewAddress] = useState({ recipientName: '', street: '', city: '', postalCode: '', phone: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (orderDetails) {
      setLoyaltyPoints(orderDetails.loyaltyPoints || 0);
      setTotalAmount(orderDetails.totalAmount);
    }
  }, [orderDetails]);

  if (!isOpen) return null;

  const handleAddNewAddress = async () => {
    if (!newAddress.recipientName || !newAddress.street || !newAddress.city || !newAddress.postalCode || !newAddress.phone) {
      setError('Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        addresses: [...addresses, newAddress],
      };
      await updateProfile(updatedData, token);

      onChange({
        ...checkoutInfo,
        address: newAddress,
      });
      addresses.push(newAddress);
      setIsAddingAddress(false);
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Lỗi khi thêm địa chỉ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (addresses.length === 0 && !checkoutInfo.address) {
      setError('Bạn cần thêm địa chỉ trước khi tiếp tục.');
      return;
    }

    setLoading(true);
    const orderData = {
      userId: orderDetails.userId,
      items: orderDetails.items,
      shippingAddress: checkoutInfo.address || addresses[0],
      paymentMethod,
      totalAmount,
      loyaltyPointsUsed,
    };

    try {
      const response = await checkoutOrder(orderData);
      setLoading(false);

      if (response && response.message) {
        setLoyaltyPoints(response.loyaltyPoints);
        onConfirm(response);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
      setError('Lỗi tạo đơn hàng.');
    }
  };

  const handleLoyaltyPointsChange = (e) => {
    let pointsUsed = parseInt(e.target.value, 10) || 0;
    const maxPoints = loyaltyPoints >= 1000 ? Math.floor(loyaltyPoints / 1000) : loyaltyPoints;
    const maxAmount = Math.floor(orderDetails.totalAmount / 1000);

    pointsUsed = pointsUsed > maxPoints ? maxPoints : pointsUsed;
    pointsUsed = pointsUsed > maxAmount ? maxAmount : pointsUsed;

    setLoyaltyPointsUsed(pointsUsed);
    setTotalAmount(orderDetails.totalAmount - pointsUsed * 1000);
};

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Đóng</button>

        {addresses.length === 0 || isAddingAddress ? (
          <>
            <h3>Thêm địa chỉ mới</h3>
            <input
              type="text"
              placeholder="Tên người nhận"
              value={newAddress.recipientName}
              onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Đường"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="Thành phố"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mã bưu điện"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />
            <button onClick={handleAddNewAddress} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Lưu địa chỉ'}
            </button>
          </>
        ) : (
          <>
            <h3>Chọn địa chỉ giao hàng</h3>
            <select value={checkoutInfo.address} onChange={(e) => onChange({ ...checkoutInfo, address: e.target.value })}>
              {addresses.map((address, index) => (
                <option key={index} value={JSON.stringify(address)}>
                  {address.street}, {address.city}, {address.postalCode} - {address.recipientName}
                </option>
              ))}
            </select>
            <button onClick={() => setIsAddingAddress(true)}>Thêm địa chỉ mới</button>
          </>
        )}

        <div>
          <h3>Phương thức thanh toán</h3>
          <select name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="credit-card">Thẻ tín dụng</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <div>
          <h3>Điểm tích lũy</h3>
          <p>Bạn có {loyaltyPoints} điểm.</p>
          <label>Sử dụng điểm: </label>
          <input
            type="number"
            id="loyaltyPoints"
            value={loyaltyPointsUsed}
            onChange={handleLoyaltyPointsChange}
            max={Math.floor(loyaltyPoints / 1000)}
            min={0}
            step={1}
          />
          <p>Được giảm: {loyaltyPointsUsed * 1000} VND</p>
        </div>

        {error && <p className="error">{error}</p>}

        <div>
          <h3>Tổng cộng: {totalAmount.toLocaleString('vi-VN')} VND</h3>
        </div>

        <button onClick={handleCheckout} disabled={loading || !paymentMethod}>
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;