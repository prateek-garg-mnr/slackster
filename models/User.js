const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  slackId: String,
  oauthToken: String,
  userChannels: Array,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
