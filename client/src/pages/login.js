import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook để điều hướng

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu POST tới API /login của service Auth
            const response = await axios.post('http://localhost:5001/api/login', { email, password });

            // Xử lý kết quả trả về từ API (response)
            console.log('Login success:', response.data);

            // Điều hướng đến trang Home nếu đăng nhập thành công
            navigate('/');
        } catch (err) {
            // Xử lý lỗi từ API
            console.error('Login failed:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed');
        }
    }

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
        </div>
    );
}

export default Login;
