require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
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
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    // Create admin user
    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      firstName: process.env.ADMIN_FIRST_NAME || "Admin",
      lastName: process.env.ADMIN_LAST_NAME || "User",
      role: "admin",
      status: "active",
    });

    console.log("Admin user created successfully:", adminUser.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
