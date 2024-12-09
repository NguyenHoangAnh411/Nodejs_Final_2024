import React, { useState } from 'react';
import { resetPassword } from '../hooks/userApi';

const ResetPassword = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await resetPassword(phone, email);
      setMessage(result.message);
      setError('');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Password Recovery</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label>Phone number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Password Recovery</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
