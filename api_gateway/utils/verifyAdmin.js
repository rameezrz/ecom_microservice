const jwt = require("jsonwebtoken");

function authenticateAdminToken(req, res, next) {
  const token = req.cookies['jwtAdmin'];

  if (!token) {
    return res.status(401).json({ message: "Admin Access Required. Please log in to Admin Panel obtain a valid token and try again." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // The user object in the decoded token can be used for further authorization checks.
    req.user = user;
    next();
  });
}

module.exports = authenticateAdminToken
