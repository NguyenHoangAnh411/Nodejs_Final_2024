import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
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
            const response = await axios.post('http://localhost:5001/api/users/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            login();
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit} method='POST'>
                <div className="login-form">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                <div>Don't have an account? <a href='/register'>Sign up</a></div>
            </div>
        </div>
    );
}

export default Login;
