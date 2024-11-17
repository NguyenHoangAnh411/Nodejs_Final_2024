import React, { useState } from 'react';
// import { guestCheckout } from '../../hooks/cartApi';

// function GuestCheckoutForm({ cart }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     address: '',
//   });

//   const handleSubmit = async () => {
//     try {
//       await guestCheckout(formData.name, formData.phone, formData.address, cart.items);
//       alert('Order placed successfully!');
//     } catch (error) {
//       alert('Guest checkout failed');
//     }
//   };

//   return (
//     <div className="guest-checkout-form">
//       <h3>Guest Checkout</h3>
//       <input
//         type="text"
//         placeholder="Name"
//         value={formData.name}
//         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//       />
//       <input
//         type="text"
//         placeholder="Phone"
//         value={formData.phone}
//         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//       />
//       <textarea
//         placeholder="Shipping Address"
//         value={formData.address}
//         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//       ></textarea>
//       <button onClick={handleSubmit}>Place Order</button>
//     </div>
//   );
// }

// export default GuestCheckoutForm;
