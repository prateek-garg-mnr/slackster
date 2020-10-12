const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    slackId: String,
    oauthToken: String,
    userConversations: Array,
    profilePicture: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
