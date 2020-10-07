const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  type: {
    type: String,
    required: true,
    enum: ["weeklyMessages", "monthlyMessages"],
  },
});

const messages = mongoose.model("messages", messageSchema);

module.exports = messages;
