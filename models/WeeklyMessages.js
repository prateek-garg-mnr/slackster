const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weeklyMessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    channelId: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const weeklyMessage = mongoose.model(
  "weeklyMessageSchema",
  weeklyMessageSchema
);

module.exports = weeklyMessage;
