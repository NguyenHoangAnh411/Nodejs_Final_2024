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

    const handleUpdateProfile = async () => {
        try {
            await updateProfile(updatedData, token);
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
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = updatedData.addresses.filter((_, i) => i !== index);
        setUpdatedData({ ...updatedData, addresses: newAddresses });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal">
            <h2>Update Profile</h2>
            <div className='UpdateProfileInfo'>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={updatedData.name}
                        onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={updatedData.phone}
                        onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                    />
                </div>
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
                        />
                    </div>
                    <div className="form-group">
                        <label>Street:</label>
                        <input
                            type="text"
                            value={address.street}
                            onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input
                            type="text"
                            value={address.city}
                            onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Postal Code:</label>
                        <input
                            type="text"
                            value={address.postalCode}
                            onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="text"
                            value={address.phone}
                            onChange={(e) => handleAddressChange(index, 'phone', e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleRemoveAddress(index)} className="remove-btn">
                        Remove Address
                    </button>
                </div>
            ))}

            <div className="button-group">
                <button onClick={handleAddAddress} className="add-btn">
                    Add Address
                </button>
                <button onClick={handleUpdateProfile} className="save-btn">
                    Save Changes
                </button>
                <button onClick={onRequestClose} className="close-btn">
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default UpdateProfileModal;
