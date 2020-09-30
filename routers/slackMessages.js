// slack aoi client
const { WebClient } = require("@slack/web-api");
// login check middleware
const requireLogin = require("../middleware/requireLogin");
module.exports = (app) => {
  // conversation list of user
  app.get("/api/conversation-list", requireLogin, async (req, res) => {
    try {
      const web = new WebClient(req.user.oauthToken);
      const list = await web.conversations.list();
      const relevantConvoData = await list.channels.map((channel) => {
        return { channelId: channel.id, channelName: channel.name };
      });
      req.user.userChannels = relevantConvoData;
      await req.user.save();
      res.send({ list: relevantConvoData });
    } catch (e) {
      console.log(e);
    }
  });

  // send a message instantly to a channel
  app.post("/api/send-message", requireLogin, async (req, res) => {
    try {
      const web = new WebClient(req.user.oauthToken);
      // const web = new WebClient(
      //   "xoxp-1364451180086-1371181799874-1370047169429-d90fc4570c2f558f33eebbff74becae0"
      // );
      const resp = await web.chat.postMessage({
        text: req.body.message,
        channel: req.body.channelId,
      });
      res.send({ resp });
    } catch (e) {
      console.log(e);
    }
  });

  // schedule a message
  app.post("/api/schedule-message", async (req, res) => {
    try {
      const web = new WebClient(req.user.oauthToken);
      const time = new Date();
      // await time.setHours(3, 16, 0);
      // const web = new WebClient();
      // "xoxp-1364451180086-1371181799874-1370047169429-d90fc4570c2f558f33eebbff74becae0"
      // "xoxb-1364451180086-1396669512496-pAEA0JnpOB5Gx4O04rtQpmMv"
      const resp = await web.chat.scheduleMessage({
        text: "Hello world! scheduled",
        channel: "C01B9PV249X",
        post_at: time.getTime() / 1000,
      });
      res.send({ resp });
    } catch (e) {
      console.log(e);
    }
  });
};
