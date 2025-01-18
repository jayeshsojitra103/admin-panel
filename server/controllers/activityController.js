const { ActivityLog } = require("../models/ActivityLog");

const activityController = {
  // Get activity logs with filtering
  async getActivityLogs(req, res) {
    try {
      const { userId, action, startDate, endDate } = req.query;
      const query = {};

      if (userId) query.user = userId;
      if (action) query.action = action;
      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const logs = await ActivityLog.find(query)
        .populate("user", "email firstName lastName")
        .sort({ timestamp: -1 });

      res.json(logs);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching activity logs",
        error: error.message,
      });
    }
  },
};

module.exports = { activityController };
