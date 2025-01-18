const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dailyActiveUsers: { type: Number, default: 0 },
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  avgSessionDuration: Number,
  topPages: [
    {
      path: String,
      views: Number,
    },
  ],
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = { Analytics };
