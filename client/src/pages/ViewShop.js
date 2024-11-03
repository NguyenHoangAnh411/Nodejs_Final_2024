import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Modal from 'react-modal'; // Import react-modal
import '../css/ViewShop.css'; // Tạo file CSS nếu cần

// Thiết lập các thuộc tính cho modal
Modal.setAppElement('#root');

function ViewShop() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopToDelete, setShopToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/shops', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setShops(response.data.shops); // Giả định response.data có thuộc tính shops
            } catch (error) {
                console.error('Error fetching shops:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, [token]);

    const handleShopClick = (shopId) => {
        navigate(`/shop/${shopId}`); // Điều hướng đến trang chi tiết của shop
    };

    const handleOpenModal = (shopId) => {
        setShopToDelete(shopId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setShopToDelete(null);
    };

    const handleDeleteShop = async () => {
        if (!shopToDelete) return; // Kiểm tra xem có shop để xóa không
        try {
            await axios.delete(`http://localhost:5000/api/shops/${shopToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShops(shops.filter(shop => shop._id !== shopToDelete)); // Cập nhật danh sách shop
            alert('Shop deleted successfully!');
        } catch (error) {
            console.error('Error deleting shop:', error);
            alert('Failed to delete shop.');
        } finally {
            handleCloseModal(); // Đóng modal sau khi xóa
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="view-shop">
            <Navbar />
            <h1>My Shops</h1>
            {shops.length === 0 ? (
                <p>No shops found. Please create a shop!</p>
            ) : (
                <div className="shop-list">
                    {shops.map((shop) => (
                        <div key={shop._id} className="shop-card" onClick={() => handleShopClick(shop._id)}>
                            <h2>{shop.name}</h2>
                            <p>Type: {shop.type}</p>
                            <p>Followers: {shop.followers}</p>
                            <p>Ratings: {shop.ratings}</p>
                            <button onClick={(e) => {
                                e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                                handleOpenModal(shop._id);
                            }}>Delete Shop</button>
                            <button onClick={() => handleShopClick(shop._id)}>View Shop</button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Confirm Delete"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this shop?</p>
                <button onClick={handleDeleteShop}>Yes, Delete</button>
                <button onClick={handleCloseModal}>Cancel</button>
            </Modal>
        </div>
    );
}

export default ViewShop;
