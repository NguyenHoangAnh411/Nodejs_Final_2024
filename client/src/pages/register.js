import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../hooks/userApi";
import "../css/Register.css";
import HomeButton from "./HomeButton"; // Import the HomeButton component

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(name, email, password, phone);
            setSuccess(response.message);
            setError("");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.error || "Registration failed");
        }
    };

    return (
        <div className="register">
            <HomeButton /> {/* Add the HomeButton */}
            <form onSubmit={handleRegister} method="POST" className="register-form">
                <h2>Register</h2>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
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
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit" className="register-button">Register</button>
                <div className="register-footer">
                    <p>Already have an account? <button onClick={() => navigate("/login")} className="link-button">Sign in</button></p>
                </div>
            </form>
        </div>
    );
}

export default Register;
