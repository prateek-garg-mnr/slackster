const axios = require("axios");
// slack web client
const { WebClient } = require("@slack/web-api");
// auth middleware
const auth = require("../middleware/auth");
// config keys
const keys = require("../config/keys");

module.exports = (app) => {
  // conversation list of user
  app.get("/api/conversation-list", auth, async (req, res) => {
    try {
      // slack web client instanve
      const web = new WebClient(req.user.oauthToken);
      // list of all the channels
      const list = await web.conversations.list({
        types: `public_channel,private_channel,im`,
      });
      // select only name and id of channel
      let channelData = await list.channels
        .map((channel) => {
          if (channel.name) {
            return { channelId: channel.id, channelName: channel.name };
          }
          return;
        })
        .filter((channel) => {
          if (channel !== null) {
            return channel;
          }
        });

      const personalDM = await list.channels
        .map((channel) => {
          if (!channel.name) {
            return { channelId: channel.id };
          }
        })
        .filter((channel) => {
          if (channel !== null) {
            return channel;
          }
        });
      console.log(personalDM);

      // save channel list on user
      req.user.userChannels = channelData;
      // save personal dm list on user
      req.user.personalDM = personalDM;
      // save user
      await req.user.save();
      // response
      res.send({ channellist: channelData, dmList: personalDM });
    } catch (e) {
      // error
      console.log("Conversation List error: ", e);
      // error from axios
      if (e.data.ok === false) {
        return res.status(400).send({ message: "invalid request" });
      }
      // other server error
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // send a message instantly to a channel
  app.post("/api/send-message", auth, async (req, res) => {
    try {
      let token;
      // data from request's body
      const { message, channelId, type } = req.body;
      // decide which token to use on the basis of type
      if (type === "user") {
        token = req.user.oauthToken;
      } else {
        token = keys.slackBotToken;
      }
      // slack client
      const web = new WebClient(token);
      // post the message instantly
      const response = await web.chat.postMessage({
        text: message,
        channel: channelId,
      });
      // response
      res.send({ response });
    } catch (e) {
      // error
      console.log("Send Instant Message error: ", e);
      // error from axios
      if (e.data.ok === false) {
        return res.status(400).send({ message: "invalid request" });
      }
      // other server error
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // schedule a message
  app.post("/api/schedule-message", auth, async (req, res) => {
    try {
      let token;
      // data from request's body
      const { message, channelId, type, time } = req.body;
      // decide which token to use on the basis of type
      if (type === "user") {
        token = req.user.oauthToken;
      } else {
        token = keys.slackBotToken;
      }
      // set schedule time
      const messageScheduleTime = new Date(time).getTime();
      // slack client
      const web = new WebClient(token);
      // schedule message to be sent
      const response = await web.chat.scheduleMessage({
        text: message,
        channel: channelId,
        post_at: messageScheduleTime / 1000,
      });
      // response
      res.send({ response });
    } catch (e) {
      // error
      console.log("Schedule Message error: ", e);
      // error from axios
      if (e.data.ok === false) {
        return res.status(400).send({ message: "invalid request" });
      }
      // other server error
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // list of scheduled message
  app.get("/api/schedule-message", auth, async (req, res) => {
    try {
      let token;
      // data from query string
      const { type } = req.query;
      // decide which token to use on the basis of type
      if (type === "user") {
        token = req.user.oauthToken;
      } else {
        token = keys.slackBotToken;
      }
      // slack client
      const web = new WebClient(token);
      // list of scheduled messages
      const response = await web.chat.scheduledMessages.list();
      // response
      res.send({ response });
    } catch (e) {
      // error
      console.log("Schedule Message error: ", e);
      // error from axios
      if (e.data.ok === false) {
        return res.status(400).send({ message: "invalid request" });
      }
      // other server error
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
};
