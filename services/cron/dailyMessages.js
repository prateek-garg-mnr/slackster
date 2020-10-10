const cron = require("node-cron");
const moment = require("moment");
const Messages = require("../../models/Message");
const keys = require("../../config/keys");
const DailyMessages = require("../../models/DailyMessages");

const slackInstance = require("../slackService");
// 0 * * * *
module.exports = cron.schedule("0 * * * *", async () => {
  // find all daily messages
  const messages = await Messages.find({
    type: "dailyMessages",
  }).populate("message user");
  // current date
  const currentDate = moment();
  // loop over messages
  for (let i = 0; i < messages.length; i++) {
    // variable for token
    let token;
    // next date to schedule
    let nextDate = moment(messages[i].message.nextDate);
    console.log(nextDate.diff(currentDate, "hours"));
    // scheduling messages one day before
    // if difference between current and nextDate = 1 hour then schedule
    if (nextDate.diff(currentDate, "hours") === 1) {
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
        // find message in daily collection
        const message = await DailyMessages.findById(messages[i].message._id);
        // update date
        message.date = nextDate.format();
        // update nextDate
        message.nextDate = nextDate.add(1, "day").format();
        // save message
        await message.save();
      }
    }
  }
});
