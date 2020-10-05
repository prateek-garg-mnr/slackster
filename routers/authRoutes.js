const axios = require("axios");
// User model
const User = require("../models/User");
// config keys
const keys = require("../config/keys");
// slack web client
const { WebClient } = require("@slack/web-api");
// JWT generator
const generateJWT = require("../services/generateJWT");
// auth middleware
const auth = require("../middleware/auth");

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
      if (response.data.authed_user === undefined) {
        return res.status(400).send(response.data);
      }
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
        // generate jwt token
        const token = await generateJWT({ id: existingUser._id });
        // return user
        return res.send({ user: existingUser, token });
      }
      // creating new user's instance
      const user = new User({
        name: name,
        email: email,
        slackId: id,
        oauthToken: access_token,
        profilePicture: image_512,
      });
      // save user
      await user.save();
      const token = await generateJWT({ id: user._id });
      // return user
      res.send({ token });
    } catch (e) {
      // log error
      console.log("Token/ User Create API ERR:", e);
      res.status(500).send();
    }
  });

  // Get User
  app.get("/api/user", auth, async (req, res) => {
    try {
      res.send({ user: req.user });
    } catch (e) {
      res.status(500).send();
    }
  });
};
