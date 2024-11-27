import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Form data:", { name, email, password, phone });
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                password,
                phone,
            });
            setSuccess(response.data.message);
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Registration failed:', err.response?.data);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };
    

    return (
        <div className="register">
            <form onSubmit={handleRegister} method='POST'>
                <div className="register-form">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
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
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input 
                            type="text" 
                            id="phone" 
                            name="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type='submit'>Register</button>
            </form>
            <div>
                <div>Already have an account? 
                    <button onClick={() => navigate('/login')}>Sign in</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
