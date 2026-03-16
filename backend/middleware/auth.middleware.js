const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorised — no token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError"
      ? "Session expired — please log in again"
      : "Invalid token";
    return res.status(401).json({ message: msg });
  }
};

module.exports = { protect };