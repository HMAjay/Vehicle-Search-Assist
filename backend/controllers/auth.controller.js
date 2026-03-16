const jwt      = require("jsonwebtoken");
const User     = require("../models/User");
const otpStore = require("../models/otpStore");

const VEHICLE_NUMBER_REGEX = /^[A-Z0-9]{4,15}$/;
const EMAIL_REGEX          = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const otp = "123456"; // demo — replace with nodemailer / SendGrid in production
    otpStore.set(email.trim(), otp);
    console.log(`[OTP] ${email}: ${otp}`);

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

    // Presence check
    if (!email || !name || !vehicleName || !vehicleNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validation
    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (name.trim().length > 60) {
      return res.status(400).json({ message: "Name is too long" });
    }
    if (!VEHICLE_NUMBER_REGEX.test(vehicleNumber.toUpperCase().trim())) {
      return res.status(400).json({ message: "Vehicle number must be 4–15 uppercase letters/digits" });
    }

    // Duplicate checks
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const existingVehicle = await User.findOne({ vehicleNumber: vehicleNumber.toUpperCase().trim() });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle number is already registered" });
    }

    const user = new User({ email, name, vehicleName, vehicleNumber, password });
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
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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