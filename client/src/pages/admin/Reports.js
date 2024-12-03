import React, { useState, useEffect } from 'react';
import {
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  Bar,
} from 'recharts';
import { getDailyRevenue, getMonthlyRevenue, getRevenueByRange } from '../../hooks/orderApi';
import '../../css/Reports.css';
import Sidebar from '../../components/Sidebar';
function Reports() {
  const [dailyRevenueData, setDailyRevenueData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredRevenueData, setFilteredRevenueData] = useState([]);

  const fetchDailyRevenue = async () => {
    setLoading(true);
    try {
      const data = await getDailyRevenue(selectedYear, selectedMonth);
      setDailyRevenueData(
        data.map((item) => ({
          name: `Ngày ${item.day}`,
          revenue: item.revenue,
        }))
      );
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu ngày:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyRevenue = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyRevenue(selectedYear);
      setMonthlyRevenueData(
        data.map((item) => ({
          name: `Tháng ${item.month}`,
          revenue: item.revenue,
        }))
      );
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tháng:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueByRange = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!');
      return;
    }

    setLoading(true);
    try {
      const data = await getRevenueByRange(startDate, endDate);
      setFilteredRevenueData(
        data.map((item) => ({
          name: `Ngày ${item.day}`,
          revenue: item.revenue,
        }))
      );
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChart === 'line' || selectedChart === 'bar') {
      fetchDailyRevenue();
    } else if (selectedChart === 'yearly') {
      fetchMonthlyRevenue();
    } else if (selectedChart === 'range') {
      fetchRevenueByRange();
    }
  }, [selectedChart, selectedMonth, selectedYear, startDate, endDate]);

  return (
    <div className="reports-container">
      <h1>Thống kê doanh thu</h1>
      <Sidebar/>
      <div className="filter-container">
        <label>
          Năm:
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          />
        </label>

        {selectedChart !== 'yearly' && (
          <label>
            Tháng:
            <input
              type="number"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            />
          </label>
        )}
        <label>
          Ngày bắt đầu:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Ngày kết thúc:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={selectedChart === 'yearly' ? fetchMonthlyRevenue : fetchDailyRevenue}>
          Tải Dữ Liệu
        </button>
      </div>

      <div className="button-container">
        <button onClick={() => setSelectedChart('line')}>Biểu đồ đường (ngày)</button>
        <button onClick={() => setSelectedChart('bar')}>Biểu đồ cột (ngày)</button>
        <button onClick={() => setSelectedChart('yearly')}>Biểu đồ doanh thu cả năm</button>
        <button onClick={() => setSelectedChart('range')}>Biểu đồ theo khoảng thời gian</button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="chart-container">
          <div className={`chart ${selectedChart === 'line' || selectedChart === 'bar' ? 'active' : ''}`}>
            {selectedChart === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {selectedChart === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={`chart ${selectedChart === 'yearly' ? 'active' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`chart ${selectedChart === 'range' ? 'active' : ''}`}>
            {filteredRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>Chưa có dữ liệu cho khoảng thời gian này</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
