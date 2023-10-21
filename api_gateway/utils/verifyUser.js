const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const token = req.cookies['jwtuser'];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access. Please log in to obtain a valid token and try again." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized access. Please log in to obtain a valid token and try again." });
    }

    // The user object in the decoded token can be used for further authorization checks.
    req.user = user;
    res.cookie("userId", user.userId); // Set the cookie as "userId"
    next();
  });
}


module.exports = authenticateToken
