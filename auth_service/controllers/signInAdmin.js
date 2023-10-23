const jwt = require("jsonwebtoken");

const signInAdmin = (req, res) => {
  try {
    const { email, password } = req.body;
    const emailDB = "admin@gmail.com";
    const passwordDB = "123";
    if (email === emailDB && password === passwordDB) {
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Send the token back to the client as a response
      res.cookie("jwtAdmin", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      // You can also send additional user information in the response if needed
      res.json({
        success: true,
        message: "Authentication successful",
        Admin: {
          email
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports={signInAdmin}