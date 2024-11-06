import axios from 'axios';

export const getUserById = async (userId) => {
    const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
    return response.data;
};