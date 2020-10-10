const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const minuteMessageSchema = new Schema(
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

const minuteMessage = mongoose.model("minuteMessages", minuteMessageSchema);

module.exports = minuteMessage;
