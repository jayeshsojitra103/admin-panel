const { Analytics } = require("../models/Analytics");

const analyticsController = {
  // Get analytics data
  async getAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const query = {};

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const analytics = await Analytics.find(query).sort({ date: -1 });
      res.json(analytics);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching analytics", error: error.message });
    }
  },

  // Update daily analytics
  async updateDailyAnalytics(req, res) {
    try {
      const { date, metrics } = req.body;

      const analytics = await Analytics.findOneAndUpdate(
        { date: new Date(date) },
        metrics,
        { new: true, upsert: true }
      );

      res.json(analytics);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating analytics", error: error.message });
    }
  },
};

module.exports = { analyticsController };
