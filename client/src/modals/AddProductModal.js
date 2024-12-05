import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../css/AddProductModal.css';
Modal.setAppElement('#root');

function AddProductModal({ isOpen, onRequestClose, onAddProduct }) {
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
            const response = await axios.post(`http://localhost:5000/api/products/add-product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Product added:', response.data);

            onAddProduct();
            onRequestClose();
            alert('Product added successfully!');

        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product!');
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
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product Description" required />
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(',', ''))}
                    placeholder="Price in VND"
                    required
                />

                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" required />
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" required />

                <div className="file-input-container">
                    <label htmlFor="file-input" className="file-label">Choose Product Images</label>
                    <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        multiple
                        onChange={handleImageChange}
                        required
                    />
                </div>

                <div className="image-preview">
                    {images && images.length > 0 && images.map((image, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`product-preview-${index}`}
                            className="image-thumbnail"
                        />
                    ))}
                </div>

                <button type="submit" className="submit-button">Add Product</button>
            </form>
        </Modal>
    );
}

export default AddProductModal;
