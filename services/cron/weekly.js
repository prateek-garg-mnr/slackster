const cron = require("node-cron");
const moment = require("moment");
const Messages = require("../../models/Messages");
const keys = require("../../config/keys");
const WeeklyMessages = require("../../models/WeeklyMessages");

const slackInstance = require("../slackService");
// 0 0 * * *
module.exports = cron.schedule("0 0 * * *", async () => {
  // find all weekly messages
  const messages = await Messages.find({
    type: "weeklyMessages",
  }).populate("message user");
  // current date
  const currentDate = moment();
  // loop over messages
  for (let i = 0; i < messages.length; i++) {
    // variable for token
    let token;
    // next date to schedule
    let nextDate = moment(messages[i].message.nextDate);
    // console.log(nextDate.format(), "-----", nextDate.add(1, "week").format());
    console.log(nextDate.diff(currentDate, "days"));

    // scheduling messages one day before
    // if difference between current and nextDate = 1 then schedule
    if (nextDate.diff(currentDate, "days") === 1) {
      // User or bot
      if (messages[i].isBot === true) {
        //bot
        token = keys.slackBotToken;
      } else {
        // user
        token = messages[i].user.oauthToken;
      }
      // message text
      let text = messages[i].message.text;
      //  channel id
      let channel = messages[i].message.channelId;
      // post time
      let post_at = nextDate.valueOf() / 1000;
      console.log(token, text, channel, post_at);
      // schedule message
      let response = await slackInstance(token, "sendScheduleMessage", {
        text,
        channel,
        post_at,
      });
      console.log(response);
      // if successfully sent
      if (response.response === true) {
        // find message in weekly collection
        const message = await WeeklyMessages.findById(messages[i].message._id);
        // update date
        message.date = nextDate.format();
        // update nextDate
        message.nextDate = nextDate.add(1, "week").format();
        // save message
        await message.save();
      }
    }
  }
});
