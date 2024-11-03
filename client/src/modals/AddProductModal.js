import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/AddProductModal.css';
Modal.setAppElement('#root');

function AddProductModal({ isOpen, onRequestClose }) {
    const { shopId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const token = localStorage.getItem('token');
    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('brand', brand);
        formData.append('stock', stock); 
    
        images.forEach((image) => {
            formData.append('images', image);
        });
    
        try {
            const response = await axios.post(`http://localhost:5000/api/products/${shopId}/add-product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Sản phẩm đã được thêm:', response.data);
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Product Modal"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h1>Thêm sản phẩm</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên sản phẩm" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả sản phẩm" required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Giá" required />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Danh mục" required />
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Thương hiệu" required />
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Số lượng" required />
                <input type="file" multiple onChange={handleImageChange} required />
                <button type="submit">Thêm sản phẩm</button>
            </form>
        </Modal>
    );
}

export default AddProductModal;
