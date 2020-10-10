const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dailyMessageSchema = new Schema(
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
    nextDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const dailyMessage = mongoose.model("dailyMessages", dailyMessageSchema);

module.exports = dailyMessage;
