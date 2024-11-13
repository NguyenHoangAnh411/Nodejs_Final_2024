import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { phone, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            login();
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit} method='POST'>
                <div className="login-form">
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
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
                            placeholder='Enter your password' 
                            required 
                        />
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <button type='submit'>Login</button>
            </form>
            <div>
                <div>Don't have an account? <button onClick={goToRegister}>Sign up</button></div>
            </div>
        </div>
    );
}

export default Login;
