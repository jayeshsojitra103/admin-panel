const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.status === "banned") {
      return res.status(401).json({ message: "Invalid or banned user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const logActivity = async (req, res, next) => {
  if (req.user) {
    const ActivityLog = require("../models/ActivityLog");
    await ActivityLog.create({
      user: req.user._id,
      action: "page_view",
      page: req.originalUrl,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin, logActivity };
