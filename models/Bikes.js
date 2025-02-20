//models/Bikes.js
const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    userName: {
      // Store the user's name instead of userId
      type: String,
      required: true,
    },
    bikeName: {
      type: String,
      required: true,
    },
    kmsDriven: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
