const moment = require("moment");
// auth middleware
const auth = require("../middleware/auth");
// config keys
const keys = require("../config/keys");
// slack instance
const slackInstance = require("../services/slackService");
// db instances
const Message = require("../models/Messages");
const InstantMessage = require("../models/InstantMessage");
const ParticularDateMessage = require("../models/particularDateMessage");
const MonthlyMessages = require("../models/MonthlyMessages");
const WeeklyMessages = require("../models/WeeklyMessages");
const MinuteMessages = require("../models/Minute");
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
      let response;
      // data from request's body
      const { message, channelId, userType, messageType, date } = req.body;
      // decide which token to use on the basis of type
      if (userType === "user") {
        token = req.user.oauthToken;
        isBot = false;
      } else {
        token = keys.slackBotToken;
        isBot = true;
      }

      // post the message instantly
      if (messageType === "instantMessage") {
        response = await slackInstance(token, "sendInstantMessage", {
          text: message,
          channel: channelId,
        });

        if (response.response === true) {
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
      }
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
      let isBot;
      let newMessage;
      // data from request's body
      const { message, channelId, type, time, messageType } = req.body;
      // decide which token to use on the basis of type
      if (type === "user") {
        token = req.user.oauthToken;
        isBot = false;
      } else {
        token = keys.slackBotToken;
        isBot = true;
      }
      // set schedule time
      const messageScheduleTime = new Date(time).getTime() / 1000;

      // schedule message to be sent
      let response = await slackInstance(token, "sendScheduleMessage", {
        text: message,
        channel: channelId,
        post_at: messageScheduleTime,
      });
      // single date schedule instance
      if (messageType === "particularDate") {
        if (response.response === true) {
          newMessage = new ParticularDateMessage({
            text: message,
            channelId,
            date: time,
          });
        }
      }
      // monthly schedule instance
      else if (messageType === "monthlyMessages") {
        const nextDate = moment(time).add(1, "month").format();
        if (response.response === true) {
          newMessage = new MonthlyMessages({
            text: message,
            channelId,
            date: time,
            nextDate,
          });
        }
      }
      // weekly schedule instance
      else if (messageType === "weeklyMessages") {
        const nextDate = moment(time).add(1, "week").format();
        if (response.response === true) {
          newMessage = new WeeklyMessages({
            text: message,
            channelId,
            date: time,
            nextDate,
          });
        }
      }
      // minute wise schedule instance
      else if (messageType === "minuteMessages") {
        const nextDate = moment(time).add(5, "minute").format();
        if (response.response === true) {
          newMessage = new MinuteMessages({
            text: message,
            channelId,
            date: time,
            nextDate,
          });
        }
      }
      // save instance
      await newMessage.save();
      // save message detail
      const messageMain = new Message({
        message: newMessage._id,
        type: messageType,
        user: req.user._id,
        isBot,
      });
      await messageMain.save();
      // response
      res.send({ response });
    } catch (e) {
      // error
      console.log("Schedule Message error: ", e);

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
