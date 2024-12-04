import React, { useState, useEffect } from 'react';
import { getUsedCoupons } from '../hooks/couponApi';
import '../css/CouponModal.css';

function CouponModal({ updateCart, onClose }) {
  const [error, setError] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const couponsList = await getUsedCoupons();
        console.log('Fetched Coupons:', couponsList);
        setCoupons(couponsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        setError('Failed to fetch coupons');
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      setError('Please select a coupon');
      return;
    }

    console.log('Selected Coupon:', selectedCoupon);

    try {
      const { discount, name, code } = selectedCoupon;
      if (discount === undefined || name === undefined || code === undefined) {
        throw new Error('Invalid coupon data');
      }

      updateCart({ discount, voucherName: name, voucherCode: code });

      onClose();
    } catch (error) {
      console.error('Error applying coupon:', error);
      setError('Failed to apply coupon');
    }
  };

  const renderCoupons = () => {
    if (loading) {
      return <div className="loading">Loading coupons...</div>;
    }

    if (coupons.length === 0) {
      return <p>No coupons available</p>;
    }

    return coupons.map((coupon) => (
      <div key={coupon._id} className="coupon-item">
        <input
          type="radio"
          id={coupon._id}
          name="coupon"
          value={coupon._id}
          checked={selectedCoupon?._id === coupon._id}
          onChange={() => setSelectedCoupon(coupon)}
        />
        <label htmlFor={coupon._id}>
          {coupon.name} - {coupon.discount}% off
          {coupon.expiryDate && (
            <span> (Expires on: {new Date(coupon.expiryDate).toLocaleDateString()})</span>
          )}
        </label>
      </div>
    ));
  };

  return (
    <div className="coupon-modal">
      <div className="coupon-header">
        <h3>Apply Coupon</h3>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
      <div className="coupon-form">
        <div className="coupon-list">
          {renderCoupons()}
        </div>

        <div className="coupon-footer">
          <button onClick={handleApplyCoupon} className="apply-btn">
            Apply
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CouponModal;
