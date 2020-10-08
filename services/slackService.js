// slack web client
const { WebClient } = require("@slack/web-api");

const slackInstance = async (token, requirement, param = {}) => {
  // slack web client instance
  const web = new WebClient(token);
  // required data type from slack
  // conversationlist
  if (requirement === "conversationList") {
    const list = await web.conversations.list({
      types: `public_channel,private_channel,im`,
    });
    return list;
  }
  // user details from id
  if (requirement === "userDetail") {
    for (let i = 0; i < param.list.length; i++) {
      console.log(param.list[i].userId);
      if (param.list[i].userId) {
        const userDetail = await web.users.info({
          user: param.list[i].userId,
        });
        param.list[i].conversationName = userDetail.user.name;
      }
    }
    return param.list;
  }

  if (requirement === "sendInstantMessage") {
    const response = await web.chat.postMessage({
      text: param.text,
      channel: param.channel,
    });
    if (response.ok === true) {
      return { response: response.ok };
    } else {
      throw new Error("error in instant message");
    }
  }
};

module.exports = slackInstance;
