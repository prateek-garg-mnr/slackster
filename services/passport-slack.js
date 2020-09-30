const passport = require("passport");
const SlackStrategy = require("passport-slack").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const keys = require("../config/keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(id);
  const user = await await User.findById(id);
  //   console.log(user);
  done(null, user);
  //   done(null, user);
});

passport.use(
  new SlackStrategy(
    {
      clientID: keys.slackClientId,
      clientSecret: keys.slackClientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ email: profile.user.email });
      if (user) {
        user.oauthToken = accessToken;
        await user.save();
        return done(null, user);
      }
      const newUser = await new User({
        name: profile.user.name,
        slackId: profile.user.id,
        email: profile.user.email,
        oauthToken: accessToken,
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);
