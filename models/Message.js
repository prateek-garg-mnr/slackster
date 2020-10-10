const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    message: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "weeklyMessages",
        "monthlyMessages",
        "particularDate",
        "instantMessage",
        "dailyMessages",
        // "minuteMessages",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isBot: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messages = mongoose.model("messages", messageSchema);

module.exports = messages;
