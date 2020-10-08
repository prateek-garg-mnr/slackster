const axios = require("axios");
// auth middleware
const auth = require("../middleware/auth");
// config keys
const keys = require("../config/keys");
// slack instance
const slackInstance = require("../services/slackService");
// db instances
const Message = require("../models/Messages");
const InstantMessage = require("../models/InstantMessage");

module.exports = (app) => {
  // conversation list of user
  app.get("/api/conversation-list", auth, async (req, res) => {
    try {
      // list of all the conversation
      const list = await slackInstance(req.user.oauthToken, "conversationList");
      // console.log("list", list);
      // selecting required data from converation list
      let conversationDataAll = await list.channels.map((channel) => {
        if (channel.name) {
          return {
            conversationId: channel.id,
            conversationName: channel.name,
          };
        } else if (channel.user) {
          return {
            conversationId: channel.id,
            userId: channel.user,
          };
        }
        return;
      });
      // list of conversations with user's names (Direct Messages)
      const conversationData = await slackInstance(
        req.user.oauthToken,
        "userDetail",
        {
          list: conversationDataAll,
        }
      );

      // save channel list on user
      req.user.userConversations = conversationData;
      // save user
      await req.user.save();
      // response
      res.send({ conversationData: conversationData });
    } catch (e) {
      // error
      console.log("Conversation List error: ", e);
      // other server error
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // send a message instantly to a channel
  app.post("/api/send-message", auth, async (req, res) => {
    try {
      let token;
      let isBot;
      // data from request's body
      const { message, channelId, userType, messageType, fromApp } = req.body;
      // decide which token to use on the basis of type
      if (userType === "user") {
        token = req.user.oauthToken;
        isBot = false;
      } else {
        token = keys.slackBotToken;
        isBot = true;
      }

      // post the message instantly
      const response = await slackInstance(
        req.user.oauthToken,
        "sendInstantMessage",
        {
          text: message,
          channel: channelId,
        }
      );

      if (response.response === true && fromApp === true) {
        const instantMessage = new InstantMessage({
          text: message,
          channelId,
        });
        await instantMessage.save();
        const messageMain = new Message({
          message: instantMessage._id,
          type: messageType,
          user: req.user._id,
          isBot,
        });
        await messageMain.save();
      }

      // response
      res.send(response);
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
