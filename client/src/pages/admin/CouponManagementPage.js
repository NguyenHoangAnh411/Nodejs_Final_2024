import React, { useState, useEffect } from 'react';
import { getAllCoupons, deleteCoupon } from '../../hooks/couponApi';
import EditCouponModal from '../../modals/EditCouponModal';
import CreateCouponModal from '../../modals/CreateCouponModal';
import '../../css/CouponManagementPage.css';
import Sidebar from '../../components/Sidebar';

function CouponManagementPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getAllCoupons();
        setCoupons(fetchedCoupons);
        setLoading(false);
      } catch (err) {
        setError('Failed to load coupons.');
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteCoupon(couponId);
      setCoupons(coupons.filter(coupon => coupon._id !== couponId));
    } catch (err) {
      setError('Failed to delete coupon.');
    }
  };

  const openEditModal = (coupon) => {
    setCurrentCoupon(coupon);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div>
      <Sidebar />
      <div className="coupon-management-page">
        <h1>Coupon Management</h1>
        {error && <p className="error">{error}</p>}

        <button onClick={openCreateModal} className="create-coupon-button">Create New Coupon</button>

        {loading ? (
          <p>Loading Coupons...</p>
        ) : (
          <table className="coupon-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.name}</td>
                  <td>{coupon.discount}%</td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeleteCoupon(coupon._id)} className="delete-btn">Delete</button>
                    <button onClick={() => openEditModal(coupon)} className="edit-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <CreateCouponModal showModal={showCreateModal} closeModal={closeCreateModal} />
        <EditCouponModal
          showModal={showEditModal}
          closeModal={closeEditModal}
          couponData={currentCoupon}
          setCoupons={setCoupons}
        />
      </div>
    </div>
  );
}

export default CouponManagementPage;
