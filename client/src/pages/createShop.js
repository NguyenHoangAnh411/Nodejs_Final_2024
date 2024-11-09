import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/CreateShop.css';

function CreateShop() {
    const [shopData, setShopData] = useState({
        name: '',
        type: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/shops/create', shopData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Shop created successfully!');
            navigate(`/shop/${response.data.shop._id}`);
        } catch (error) {
            console.error('Error creating shop:', error);
            alert('Failed to create shop.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-shop">
            <Navbar />
            <h1>Create New Shop</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={shopData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type:
                        <select
                            name="type"
                            value={shopData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Food">Food</option>
                            <option value="Books">Books</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Home Goods">Home Goods</option>

                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={shopData.description}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Shop'}
                </button>
            </form>
        </div>
    );
}

export default CreateShop;
