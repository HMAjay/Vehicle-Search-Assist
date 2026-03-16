const express = require("express");
const router  = express.Router();

const { getVehicleByNumber } = require("../controllers/vehicle.controller");
const { protect }            = require("../middleware/auth.middleware");
router.get("/count", async (req, res, next) => {
  try {
    const User = require("../models/User");
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    next(err);
  }
});
router.get("/:vehicleNumber", protect, getVehicleByNumber);

module.exports = router;