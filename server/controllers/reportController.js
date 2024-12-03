const Report = require('../models/ReportModel');

const getReportData = async (req, res) => {
  try {
    const revenueOverTime = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [5000, 7000, 8000, 6500, 7200, 8000],
    };

    const topProducts = await Report.find({}).sort({ revenue: -1 }).limit(5);
    const products = topProducts.map((product, index) => ({
      name: product.name,
      unitsSold: product.unitsSold,
      revenue: product.revenue,
    }));

    res.status(200).json({
      revenueOverTime,
      topProducts: products,
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReportData };
