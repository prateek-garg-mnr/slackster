const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const particularDateMessageSchema = new Schema(
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

const particularDateMessage = mongoose.model(
  "particularDate",
  particularDateMessageSchema
);

module.exports = particularDateMessage;
