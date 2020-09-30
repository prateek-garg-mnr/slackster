const User = require("../models/User");
const axios = require("axios");
const keys = require("../config/keys");
const { WebClient } = require("@slack/web-api");

module.exports = (app) => {
  // Register user
  app.post("/api/slack-token", async (req, res) => {
    try {
      // code from slack
      const { code } = req.body;
      // exchange code for token
      const response = await axios.get(
        `https://slack.com/api/oauth.v2.access?code=${code}&client_id=${keys.slackClientId}&client_secret=${keys.slackClientSecret}&redirect_uri=${keys.redirect_uri}`
      );
      console.log(response);
      // slack oauth token
      const access_token = response.data.authed_user.access_token;
      // clack web client initialization
      const web = new WebClient(access_token);
      // fetching user's data
      const userData = await web.users.identity();
      const { name, email, id, image_512 } = userData.user;
      // checking if the user exists
      const existingUser = await User.findOne({ slackId: id, email });
      // if user exists return that user
      if (existingUser) {
        // update user's oauth token
        existingUser.oauthToken = access_token;
        // save user
        await existingUser.save();
        // return user
        return res.send(existingUser);
      }
      // creating new user;s instance
      const user = new User({
        name: name,
        email: email,
        slackId: id,
        oauthToken: access_token,
        profilePicture: image_512,
      });
      // save user
      await user.save();
      // return user
      res.send(user);
    } catch (e) {
      console.log(e);
    }
  });
};
