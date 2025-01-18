require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { ActivityLog } = require("../models/ActivityLog");
const { Analytics } = require("../models/Analytics");

const actions = ["login", "logout", "download", "page_view"];
const pages = [
  "/home",
  "/listings",
  "/property/1",
  "/property/2",
  "/search",
  "/contact",
  "/about",
];

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Get all users for reference
    const users = await User.find({});
    if (users.length === 0) {
      console.log("No users found. Please create some users first.");
      return;
    }

    // Generate Analytics Data (50 days)
    console.log("Generating Analytics data...");
    const analyticsData = [];
    const endDate = new Date();

    for (let i = 0; i < 50; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);

      const topPagesCount = generateRandomNumber(3, 7);
      const topPages = pages
        .sort(() => 0.5 - Math.random())
        .slice(0, topPagesCount)
        .map((page) => ({
          path: page,
          views: generateRandomNumber(50, 500),
        }));

      analyticsData.push({
        date,
        dailyActiveUsers: generateRandomNumber(100, 1000),
        pageViews: generateRandomNumber(500, 5000),
        uniqueVisitors: generateRandomNumber(200, 2000),
        avgSessionDuration: generateRandomNumber(60, 3600), // 1 minute to 1 hour in seconds
        topPages,
      });
    }

    await Analytics.deleteMany({}); // Clear existing data
    await Analytics.insertMany(analyticsData);
    console.log("Analytics data generated successfully!");

    // Generate Activity Logs (50 entries per user)
    console.log("Generating Activity Logs...");
    const activityLogs = [];

    for (const user of users) {
      for (let i = 0; i < 50; i++) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - generateRandomNumber(0, 49));
        date.setHours(generateRandomNumber(0, 23));
        date.setMinutes(generateRandomNumber(0, 59));

        activityLogs.push({
          user: user._id,
          action: actions[Math.floor(Math.random() * actions.length)],
          page: pages[Math.floor(Math.random() * pages.length)],
          ipAddress: `${generateRandomNumber(1, 255)}.${generateRandomNumber(
            1,
            255
          )}.${generateRandomNumber(1, 255)}.${generateRandomNumber(1, 255)}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          timestamp: date,
        });
      }
    }

    await ActivityLog.deleteMany({}); // Clear existing data
    await ActivityLog.insertMany(activityLogs);
    console.log("Activity Logs generated successfully!");

    // Print summary
    console.log("\nData Generation Summary:");
    console.log(`Analytics Entries: ${analyticsData.length}`);
    console.log(`Activity Logs: ${activityLogs.length}`);
  } catch (error) {
    console.error("Error generating dummy data:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

generateDummyData();
