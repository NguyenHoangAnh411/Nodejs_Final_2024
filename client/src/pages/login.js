import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";
import HomeButton from "./HomeButton"; // Import the HomeButton component

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { phone, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      login();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToRecovery = () => {
    navigate("/reset-password");
  };

  return (
    <div className="login">
      <HomeButton />
      <form onSubmit={handleSubmit} method="POST" className="login-form">
        <h2>Login</h2>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Login</button>
        <div className="login-footer">
          <p>Don't have an account? <button onClick={goToRegister} className="link-button">Sign up</button></p>
          <p>Forgot password?{" "}
            <button onClick={goToRecovery} className="link-button">
              Recover Password
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
