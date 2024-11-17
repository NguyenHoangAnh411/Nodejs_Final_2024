// import React, { useState } from 'react';
// import { guestCheckout } from '../hooks/cartApi';

// const GuestCheckoutPage = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [addresses, setAddresses] = useState([]);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState('');

//   const handleCheckout = async () => {
//     try {
//       const order = await guestCheckout({ name, phone, addresses, items });
//       console.log('Order placed:', order);
//     } catch (error) {
//       setError('Error during checkout.');
//     }
//   };

//   return (
//     <div>
//       <h1>Guest Checkout</h1>
//       {error && <p>{error}</p>}
//       <div>
//         <label>Name:</label>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//       </div>
//       <div>
//         <label>Phone:</label>
//         <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
//       </div>
//       <div>
//         <label>Addresses:</label>
//         <textarea value={addresses} onChange={(e) => setAddresses(e.target.value)} />
//       </div>

//       <div>
//         <button onClick={handleCheckout}>Checkout</button>
//       </div>
//     </div>
//   );
// };

// export default GuestCheckoutPage;
