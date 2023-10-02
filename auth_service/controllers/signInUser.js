const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const userSignIn = async (req, res) => {
  try {
    // Parse user input (e.g., email/username and password) from the request body
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send the token back to the client as a response
    res.cookie("jwtuser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // You can also send additional user information in the response if needed
    res.json({
      success: true,
      message: "Authentication successful",
      user: {
        Id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
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
  userSignIn,
};
