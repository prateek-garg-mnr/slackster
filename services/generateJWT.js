const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
module.exports = async (data) => {
  const token = await jwt.sign(data, keys.jwtEncryptionKey);
  return token;
};
