const { User } = require("../models/User");

const userController = {
  // Get all users with optional filters
  async getUsers(req, res) {
    try {
      const {
        status,
        role,
        search,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;
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

      const options = {
        sort: { date: -1 },
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        select: "-password",
      };

      const [users, total] = await Promise.all([
        User.find(query, null, options),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        users,
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
      });
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
