const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  register,
  login,
} = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/rateLimit.middleware");

router.post("/send-otp", authLimiter, sendOtp);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
