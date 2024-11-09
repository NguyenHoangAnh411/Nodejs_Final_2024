import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddProductModal from '../modals/AddProductModal';
import EditShopModal from '../modals/EditShopModal';
import '../css/ShopDetail.css';
import Sidebar from '../components/Sidebar';
function ShopDetail() {
    const { shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [productModalIsOpen, setProductModalIsOpen] = useState(false);
    const [initialShopData, setInitialShopData] = useState(null);
    const [categories, setCategories] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchShopDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/shops/${shopId}`);
                setShop(response.data.shop);
                setInitialShopData(response.data.shop);

                const categoryIds = response.data.shop.products.map(product => product.category);
                const categoryPromises = categoryIds.map(id => axios.get(`http://localhost:5000/api/category/getcategories/${id}`));
                const categoryResponses = await Promise.all(categoryPromises);

                const categoryMap = categoryResponses.reduce((acc, res) => {
                    acc[res.data._id] = res.data;
                    return acc;
                }, {});
                setCategories(categoryMap);
            } catch (error) {
                console.error('Error fetching shop details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetail();
    }, [shopId]);

    const handleEditShop = () => {
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const handleProductModalOpen = () => {
        setProductModalIsOpen(true);
    };

    const handleProductModalClose = () => {
        setProductModalIsOpen(false);
    };

    const handleUpdateShop = async (updatedData) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/shops/${shopId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShop(response.data.shop);
            setInitialShopData(response.data.shop);
            handleCloseModal();
            alert('Shop updated successfully');
        } catch (error) {
            console.error('Error updating shop:', error);
            alert('Failed to update shop.');
        }
    };

    const refreshShopDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/shops/${shopId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShop(response.data.shop);
        } catch (error) {
            console.error('Error fetching shop details:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!shop) {
        return <p>Shop not found.</p>;
    }

    return (
        <div className="shop-detail">
            <Navbar />
            <Sidebar/>
            <div className="shopDetail-content">
                <div className="main-content">
                    <h1>{shop.name}</h1>
                    <p><strong>Type:</strong> {shop.type}</p>
                    <p><strong>Followers:</strong> {shop.followers}</p>
                    <p><strong>Ratings:</strong> {shop.ratings}</p>
                    <p><strong>Description:</strong> {shop.description || 'No description available.'}</p>

                    <h2>List of Products:</h2>
                    <div className="product-list">
                        {Array.isArray(shop.products) && shop.products.length > 0 ? (
                            shop.products.map(product => {
                                const category = categories[product.category];
                                return (
                                    <div key={product._id} className="product-card">
                                        <h3>{product.name}</h3>
                                        <p><strong>Description:</strong> {product.description}</p>
                                        <p><strong>Price:</strong> ${product.price}</p> 
                                        <p><strong>Category:</strong> {category ? category.name : 'Loading category...'}</p>
                                        <p><strong>Brand:</strong> {product.brand}</p>
                                        <p><strong>Stock:</strong> {product.stock}</p>
                                        <div>
                                            <strong>Images:</strong>
                                            {Array.isArray(product.images) && product.images.map(image => (
                                                <img key={image._id} src={image.url} alt={image.alt} style={{ width: '100px', margin: '5px' }} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No products available.</p>
                        )}
                    </div>

                    <button onClick={handleEditShop}>Edit Shop</button>
                    <button onClick={handleProductModalOpen}>Add Product</button>

                    <AddProductModal
                        isOpen={productModalIsOpen}
                        onRequestClose={handleProductModalClose}
                        onAddProduct={refreshShopDetail}
                    />

                    <EditShopModal
                        isOpen={modalIsOpen}
                        onRequestClose={handleCloseModal}
                        onEditShopProduct={handleUpdateShop}
                        initialShopData={initialShopData}
                    />
                    </div>
            </div>
        </div>
    );
}

export default ShopDetail;
