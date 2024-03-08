const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`database is connected`);
  } catch (error) {
    next(error);
  }
};

module.exports = dbConnect;
