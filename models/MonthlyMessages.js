const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const monthlyMessageSchema = new Schema(
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

const monthlyMessage = mongoose.model("monthlyMessage", monthlyMessageSchema);

module.exports = monthlyMessage;
