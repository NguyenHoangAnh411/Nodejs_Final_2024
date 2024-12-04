import React, { useState } from 'react';
import { createUser } from '../hooks/userApi'; // Import hàm API createUser
import { addCartNotLoggedUser } from '../hooks/cartApi';
function CreateAccountModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState('');

  const handleAddAddress = () => {
    if (!recipientName || !street || !city || !postalCode || !addressPhone) {
      setError('Please fill in all address fields');
      return;
    }

    const newAddress = {
      recipientName,
      street,
      city,
      postalCode,
      phone: addressPhone
    };

    setAddresses([...addresses, newAddress]);
    setRecipientName('');
    setStreet('');
    setCity('');
    setPostalCode('');
    setAddressPhone('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addresses.length === 0) {
      setError('Please add at least one address');
      return;
    }

    if (!name || !phone || !email) {
      setError('Please fill in all fields');
      return;
    }

    const userData = {
      name,
      phone,
      email,
      addresses, 
    };
  
    try {
      const userId = await createUser(userData);
  
      if (userId) {
        console.log('User created with ID:', userId);

        const cartData = JSON.parse(localStorage.getItem('cart')) || []; 

        if (cartData && cartData.items.length > 0) {

          cartData.items.forEach(async (item) => {
            const productId = item.productId._id;

            await addCartNotLoggedUser(userId, productId);
          });
  
          console.log('Cart updated for user with ID:', userId);
          onCreate(userId);
        } else {
          setError('Invalid cart data');
        }
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error during user creation:', error);
    }
  };
  
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Create Account</h2>
          {error && <p className="error">{error}</p>}
          
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          
          <h3>Address</h3>
          <input
            type="text"
            placeholder="Recipient Name"
            value={recipientName}
            onChange={e => setRecipientName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={e => setStreet(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={addressPhone}
            onChange={e => setAddressPhone(e.target.value)}
          />
          <button onClick={handleAddAddress}>Add Address</button>

          <h4>Addresses</h4>
          {addresses.map((address, index) => (
            <div key={index}>
              <p>{address.recipientName}, {address.street}, {address.city}, {address.postalCode}, {address.phone}</p>
            </div>
          ))}
          
          <button onClick={handleSubmit}>Create Account</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
}

export default CreateAccountModal;
