import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api/reports';
const token = localStorage.getItem('token');

export const getReportData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch report data');
    }
};
  