const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protectUser = async (req, res, next) => {
  let token;
  token = req.cookies.jwtuser;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorised , invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorised , no token");
  }
};

module.exports = {
    protectUser
}
