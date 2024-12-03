import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const token = localStorage.getItem('token');

export const getUserById = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
};

export const getUsers = async (search) => {
  try {
    const response = await axios.get(`${API_URL}/?search=${search}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch users');
  }
};


  export const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : 'Failed to delete User');
    }
  };

  export const getUserData = async () => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await axios.post(
      `${API_URL}/change-password`,
      { oldpassword: oldPassword, newpassword: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append('avatar', file);
  formData.append('userId', userId);

  const response = await axios.put(`${API_URL}/profile/avatar`, formData, {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
      },
  });

  return response.data;
};

export const updateProfile = async (updatedData, token) => {
  try {
      const response = await axios.put(`${API_URL}/profile`, updatedData, {
          headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
  } catch (error) {
      throw error;
  }
};