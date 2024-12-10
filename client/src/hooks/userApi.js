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

export const resetPassword = async (phone, email) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      phone,
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
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
        headers: { 
          'Authorization': `Bearer ${token}`, 
        }
      });      
      return response.data;
  } catch (error) {
      throw error;
  }
};

export const banUser = async (userId, banned) => {
  try {
      const response = await axios.patch(
          `${API_URL}/${userId}/ban`,
          { banned },
          {
              headers: { Authorization: `Bearer ${token}` },
          }
      );
      return response.data;
  } catch (error) {
      throw new Error(
          error.response ? error.response.data.message : 'Failed to ban/unban user'
      );
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
      const response = await axios.put(
          `${API_URL}/${userId}`,
          updatedData,
          {
              headers: { Authorization: `Bearer ${token}` },
          }
      );
      return response.data;
  } catch (error) {
      throw new Error(
          error.response ? error.response.data.message : 'Failed to update user'
      );
  }
};

export const registerUser = async (name, email, password, phone) => {
  try {
      const response = await axios.post(`${API_URL}/register`, {
          name,
          email,
          password,
          phone,
      });
      return response.data;
  } catch (err) {
      throw err.response?.data || { error: 'Registration failed' };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User created successfully:', data);
      return data.userId; 
    } else {
      console.error('Failed to create user:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error while creating user:', error);
    return null;
  }
};