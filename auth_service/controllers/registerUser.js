const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const { generateUserToken } = require("../utils/generateToken");

const userSignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    } else {
      const newUser = new User({
        name,
        email,
        phone,
      });
      newUser.password = await bcrypt.hash(password, 10);
      newUser.save().then((user) => {
        generateUserToken(res, user._id);
        res.json({
          success: true,
          message: "User created successfully",
          user: {
            Id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
        });
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Internal server error... ${error.message}`,
      });
  }
};

module.exports = {
  userSignUp,
};
