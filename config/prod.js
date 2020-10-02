// development keys
module.exports = {
  slackClientId: process.env.SLACK_CLIENT_ID,
  slackClientSecret: process.env.SLACK_CLIENT_SECRET,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  cookieKey: process.env.COOKIE_KEY,
  mongodbURL: process.env.MONGODB_URL,
  redirect_uri: process.env.REDIRECT_URI,
  jwtEncryptionKey: process.env.JWT_ENCRYPTION_KEY,
};
