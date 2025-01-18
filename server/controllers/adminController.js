const { User } = require("../models/User");

const userController = {
  // Get all users with optional filters
  async getUsers(req, res) {
    try {
      const { status, role, search, startDate, endDate } = req.query;
      const query = { role: { $ne: "admin" } }; // Exclude users with role "admin"

      if (status) query.status = status;
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { email: new RegExp(search, "i") },
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
        ];
      }
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const users = await User.find(query)
        .select("-password")
        .sort({ date: -1 }); // Sort by most recent users

      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  },
  // Approve a pending user
  async approveUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: "active" },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error approving user", error: error.message });
    }
  },

  // Ban/unban a user
  async toggleBanUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = user.status === "banned" ? "active" : "banned";
      await user.save();

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user status", error: error.message });
    }
  },
};

module.exports = { userController };
