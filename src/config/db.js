const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    // Open the single MongoDB connection used by the API process.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectToDB;
