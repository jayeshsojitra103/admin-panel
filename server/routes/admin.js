const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/adminController");
const { analyticsController } = require("../controllers/analyticsController");
const { activityController } = require("../controllers/activityController");
const { loginAdmin } = require("../controllers/authController");

const {
  authenticateToken,
  requireAdmin,
  logActivity,
} = require("../middleware/authMiddleware");

// Admin login
router.post("/login", loginAdmin);

// Apply authentication and admin check to all admin routes
router.use(authenticateToken, requireAdmin);

// User management routes
router.get("/users", userController.getUsers);
router.put("/users/:id/approve", userController.approveUser);
router.put("/users/:id/toggle-ban", userController.toggleBanUser);

// Analytics routes
router.get("/analytics", analyticsController.getAnalytics);
router.post("/analytics", analyticsController.updateDailyAnalytics);

// Activity log routes
router.get("/activity", activityController.getActivityLogs);

module.exports = router;
