import React, { useState } from 'react';
import Modal from 'react-modal';
import { updateProfile } from '../hooks/userApi';
import '../css/UpdateProfileModal.css';

Modal.setAppElement('#root');

function UpdateProfileModal({ isOpen, onRequestClose, userData, token, onProfileUpdated }) {
    const [updatedData, setUpdatedData] = useState({
        name: userData.name || '',
        phone: userData.phone || '',
        addresses: userData.addresses || [],
    });
    const [error, setError] = useState('');

    const handleUpdateProfile = async () => {
        if (!updatedData.name || !updatedData.phone) {
            setError('Name and phone are required.');
            return;
        }
        try {
            await updateProfile(updatedData, token);
            alert('Profile updated successfully');
            onProfileUpdated(updatedData);
            onRequestClose();
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('An error occurred. Please try again.');
        }
    };

    const handleAddAddress = () => {
        setUpdatedData({
            ...updatedData,
            addresses: [
                ...updatedData.addresses,
                { recipientName: '', street: '', city: '', postalCode: '', phone: '' },
            ],
        });
    };

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...updatedData.addresses];
        newAddresses[index][field] = value;
        setUpdatedData({ ...updatedData, addresses: newAddresses });
        setError('');
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = updatedData.addresses.filter((_, i) => i !== index);
        setUpdatedData({ ...updatedData, addresses: newAddresses });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="custom-modal">
            <h2 className="modal-title">Update Your Profile</h2>
            <div className="form-container">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={updatedData.name}
                        onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={updatedData.phone}
                        onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                        placeholder="Enter your phone"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            <h3>Addresses</h3>
            {updatedData.addresses.map((address, index) => (
                <div className="address-form" key={index}>
                    <div className="form-group">
                        <label>Recipient Name:</label>
                        <input
                            type="text"
                            value={address.recipientName}
                            onChange={(e) => handleAddressChange(index, 'recipientName', e.target.value)}
                            placeholder="Enter recipient name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Street:</label>
                        <input
                            type="text"
                            value={address.street}
                            onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                            placeholder="Enter street"
                        />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input
                            type="text"
                            value={address.city}
                            onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                            placeholder="Enter city"
                        />
                    </div>
                    <div className="form-group">
                        <label>Postal Code:</label>
                        <input
                            type="text"
                            value={address.postalCode}
                            onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                            placeholder="Enter postal code"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={address.phone}
                            onChange={(e) => handleAddressChange(index, 'phone', e.target.value)}
                            placeholder="Enter phone"
                        />
                    </div>
                </div>
            ))}

            <div className="address-buttons">
                <button onClick={handleAddAddress} className="add-btn">
                    Add Address
                </button>
                <button onClick={handleUpdateProfile} className="save-btn">
                    Save
                </button>
                {updatedData.addresses.length > 0 && (
                    <div className="remove-address-buttons">
                        <button
                            onClick={() => handleRemoveAddress(0)}
                            className="remove-btn"
                        >
                            Remove
                        </button>
                    </div>
                )}

            </div>

        </Modal>
    );
}

export default UpdateProfileModal;
