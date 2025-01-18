const { ActivityLog } = require("../models/ActivityLog");

const activityController = {
  // Get activity logs with filtering
  async getActivityLogs(req, res) {
    try {
      const {
        userId,
        action,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;
      const query = {};

      if (userId) query.user = userId;
      if (action) query.action = action;
      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const options = {
        sort: { timestamp: -1 },
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        populate: { path: "user", select: "email firstName lastName" },
      };

      const [logs, total] = await Promise.all([
        ActivityLog.find(query, null, options),
        ActivityLog.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        logs,
        currentPage: parseInt(page),
        totalPages,
        totalLogs: total,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching activity logs",
        error: error.message,
      });
    }
  },
};

module.exports = { activityController };
