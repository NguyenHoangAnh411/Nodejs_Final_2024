import React, { useState } from "react";
import { resetPassword } from "../hooks/userApi";
import { useNavigate } from "react-router-dom";
import "../css/HomeButton.css"; // Import CSS từ HomeButton.css
import "../css/ResetPassword.css"; // Import CSS dành cho ResetPassword

const ResetPassword = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const result = await resetPassword(phone, email);
      setMessage(result.message);
      setError("");
    } catch (err) {
      setError(err.message || "An error occurred");
      setMessage("");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="reset-password">
      {/* Nút Home */}
      <button className="home-button" onClick={() => navigate("/")}>
        Home
      </button>

      <form onSubmit={handleResetPassword} method="POST" className="reset-password-form">
        <h2>Password Recovery</h2>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="reset-password-button">Recover Password</button>
        <div className="reset-password-footer">
          <p>
            Remember your password?{" "}
            <button onClick={goToLogin} className="link-button">
              Back to Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
