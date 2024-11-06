import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../css/EditShopModal.css'
Modal.setAppElement('#root');

function EditShopModal({ isOpen, onRequestClose, onEditShopProduct, initialShopData }) {
    const [tempShopData, setTempShopData] = useState(initialShopData);

    useEffect(() => {
        setTempShopData(initialShopData);
    }, [initialShopData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempShopData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (JSON.stringify(tempShopData) === JSON.stringify(initialShopData)) {
            alert('No changes detected.');
            return;
        }

        onEditShopProduct(tempShopData); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Shop Modal"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h1>Edit Shop</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={tempShopData?.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type:
                        <select
                            name="type"
                            value={tempShopData?.type || ''}
                            onChange={handleChange}
                            required
                        >
                            <option value="Clothing">Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Food">Food</option>
                            <option value="Books">Books</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Home Goods">Home Goods</option>
                            <option value="standard">Standard</option>
                            <option value="mall">Mall</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={tempShopData?.description || ''}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="modal-actions">
                    <button type="submit">Update Shop</button>
                    <button type="button" onClick={onRequestClose}>Cancel</button>
                </div>

            </form>
        </Modal>
    );
}

export default EditShopModal;
