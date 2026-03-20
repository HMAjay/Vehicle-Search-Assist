const jwt = require("jsonwebtoken");
const User = require("../models/User");
const otpStore = require("../models/otpStore");
const { sendOtpEmail } = require("../utils/mailer");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /auth/send-otp ───────────────────────────────────────────────────────
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.trim(), otp);

    // send email
    await sendOtpEmail(email.trim(), otp);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/verify-otp ─────────────────────────────────────────────────────
const verifyOtp = (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = otpStore.verify(email.trim(), String(otp).trim());
    if (!result.valid) {
      return res.status(401).json({ message: result.reason });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/register ───────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { email, name, vehicleName, vehicleNumber, password } = req.body;

    if (!email || !name || !vehicleName || !vehicleNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new User({
      email,
      name,
      vehicleName,
      vehicleNumber,
      password,
    });
    await user.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    next(err);
  }
};

// ── POST /auth/login ──────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: user.toPublic(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendOtp, verifyOtp, register, login };
