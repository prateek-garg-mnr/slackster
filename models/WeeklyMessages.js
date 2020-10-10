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
    nextDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const weeklyMessage = mongoose.model("weeklyMessage", weeklyMessageSchema);

module.exports = weeklyMessage;
