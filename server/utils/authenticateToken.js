const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, keys.jwt, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(req.user);
    next();
  });
};

module.exports = authenticateToken;
