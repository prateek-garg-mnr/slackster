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
  },
  { timestamps: true }
);

const monthlyMessageSchema = mongoose.model(
  "monthlyMessageSchema",
  monthlyMessageSchema
);

module.exports = monthlyMessage;
