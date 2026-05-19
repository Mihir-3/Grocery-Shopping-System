const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.token;

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = verified;
    next();
  } catch {
    res.status(400).send("Invalid Token");
  }
};