import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../css/UpdateProfileModal.css'
Modal.setAppElement('#root');

function UpdateProfileModal({ isOpen, onRequestClose, userData, token, onProfileUpdated }) {
    const [updatedData, setUpdatedData] = useState({
        name: userData.name || '',
        phone: userData.phone || '',
        addresses: userData.addresses || []
    });

    const handleUpdateProfile = async () => {
        try {
            await axios.put('http://localhost:5000/api/users/profile', updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated successfully');
            onProfileUpdated(updatedData);
            onRequestClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    const handleAddAddress = () => {
        setUpdatedData({
            ...updatedData,
            addresses: [...updatedData.addresses, { recipientName: '', street: '', city: '', postalCode: '', phone: '' }]
        });
    };

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...updatedData.addresses];
        newAddresses[index][field] = value;
        setUpdatedData({ ...updatedData, addresses: newAddresses });
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = updatedData.addresses.filter((_, i) => i !== index);
        setUpdatedData({ ...updatedData, addresses: newAddresses });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal">
            <h2>Update Profile</h2>
            <label>
                Name:
                <input
                    type="text"
                    value={updatedData.name}
                    onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                />
            </label>
            <label>
                Phone:
                <input
                    type="text"
                    value={updatedData.phone}
                    onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                />
            </label>
            <h3>Addresses</h3>
            {updatedData.addresses.map((address, index) => (
                <div key={index}>
                    <label>Recipient Name: <input type="text" value={address.recipientName} onChange={(e) => handleAddressChange(index, 'recipientName', e.target.value)} /></label>
                    <label>Street: <input type="text" value={address.street} onChange={(e) => handleAddressChange(index, 'street', e.target.value)} /></label>
                    <label>City: <input type="text" value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} /></label>
                    <label>Postal Code: <input type="text" value={address.postalCode} onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)} /></label>
                    <label>Phone: <input type="text" value={address.phone} onChange={(e) => handleAddressChange(index, 'phone', e.target.value)} /></label>
                    <button onClick={() => handleRemoveAddress(index)}>Remove Address</button>
                </div>
            ))}
            <button onClick={handleAddAddress}>Add Address</button>
            <button onClick={handleUpdateProfile}>Save Changes</button>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default UpdateProfileModal;
