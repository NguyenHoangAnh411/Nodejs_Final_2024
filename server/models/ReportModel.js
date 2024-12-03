const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  name: String,
  unitsSold: Number,
  revenue: Number,
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
