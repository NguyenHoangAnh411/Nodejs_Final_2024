import React, { useState, useEffect } from 'react';
import { updateCouponById } from '../hooks/couponApi';
import '../css/EditCouponModal.css';

function EditCouponModal({ showModal, closeModal, couponData, setCoupons }) {
  const [coupon, setCoupon] = useState({
    code: '',
    name: '',
    discount: '',
    expiryDate: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (couponData) {
      setCoupon({
        code: couponData.code || '',
        name: couponData.name || '',
        discount: couponData.discount || '',
        expiryDate: couponData.expiryDate || '',
      });
    }
  }, [couponData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coupon.code || !coupon.name || !coupon.discount || !coupon.expiryDate) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const updatedCoupon = await updateCouponById(couponData._id, coupon);
      setCoupons(prevCoupons => prevCoupons.map(c => (c._id === updatedCoupon._id ? updatedCoupon : c)));
      closeModal();
    } catch (err) {
      setError('Failed to update coupon.');
    }
  };

  return (
    showModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Edit Coupon</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Coupon Code:
              <input
                type="text"
                value={coupon.code}
                onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                value={coupon.name}
                onChange={(e) => setCoupon({ ...coupon, name: e.target.value })}
              />
            </label>
            <label>
              Discount:
              <input
                type="number"
                value={coupon.discount}
                onChange={(e) => setCoupon({ ...coupon, discount: e.target.value })}
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="date"
                value={coupon.expiryDate}
                onChange={(e) => setCoupon({ ...coupon, expiryDate: e.target.value })}
              />
            </label>
            <div className="modal-buttons">
              <button type="button" onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default EditCouponModal;
