const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const instantMessageSchema = new Schema(
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

const instantMessage = mongoose.model("instantMessage", instantMessageSchema);

module.exports = instantMessage;
