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
  },
  { timestamps: true }
);

const monthlyMessageSchema = mongoose.model(
  "monthlyMessageSchema",
  monthlyMessageSchema
);

module.exports = monthlyMessage;
