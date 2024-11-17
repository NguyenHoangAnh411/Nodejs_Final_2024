import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCoupon, getAllCoupons } from '../hooks/couponApi';
import '../css/CreateCouponModal.css';

function CreateCouponModal({ showModal, closeModal }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const generateCouponCode = (coupons) => {
    const lastCoupon = coupons[coupons.length - 1];
    const newCode = lastCoupon
      ? `COUPON${parseInt(lastCoupon.code.replace('COUPON', '')) + 1}`
      : 'COUPON1';
    return newCode;
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getAllCoupons();
        const newCode = generateCouponCode(fetchedCoupons);
        setCode(newCode);

        const today = new Date().toISOString().split('T')[0];
        setExpiryDate(today);
      } catch (err) {
        setError('Failed to load coupons.');
      }
    };

    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure expiryDate is valid before submitting
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        setError('Invalid expiry date');
        setLoading(false);
        return;
      }

      await createCoupon({ code, name, discount, expiryDate });
      setLoading(false);
      closeModal();
      navigate('/coupon-management');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create coupon');
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create New Coupon</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Coupon Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Coupon Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="date"
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCouponModal;
