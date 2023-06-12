const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  electricityGenerated: {
    type: Number,
    required: true,
  }
});

const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

module.exports = DailyReport;
