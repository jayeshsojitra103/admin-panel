require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("../models/User");

const verifyAdminUser = async () => {
  try {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connected");
    } catch (error) {
      console.error("Database Connection Error:", error.message);
      process.exit(1);
    }

    const adminUser = await User.findOne({
      email: process.env.ADMIN_EMAIL,
      role: "admin",
    });

    if (adminUser) {
      console.log("Admin user verified:", {
        email: adminUser.email,
        status: adminUser.status,
        created: adminUser.createdAt,
      });
    } else {
      console.log("Admin user not found!");
    }
  } catch (error) {
    console.error("Error verifying admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

verifyAdminUser();
