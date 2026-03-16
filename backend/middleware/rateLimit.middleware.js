const rateLimit = require("express-rate-limit");

// Strict limiter for auth endpoints — prevents brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please wait 15 minutes and try again." },
});

// Looser limiter for search / general API
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." },
});

module.exports = { authLimiter, searchLimiter };