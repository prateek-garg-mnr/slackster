const jwt = require("jsonwebtoken");
const User = require("../models/User");
const keys = require("../config/keys");
module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, keys.jwtEncryptionKey);
    const { id } = decoded;
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).send({ message: "Please Authenticate Perfect" });
  }
};
