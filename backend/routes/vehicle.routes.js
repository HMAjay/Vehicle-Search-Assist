const express = require("express");
const router  = express.Router();

const { getVehicleByNumber } = require("../controllers/vehicle.controller");
const { protect }            = require("../middleware/auth.middleware");
const { searchLimiter }      = require("../middleware/rateLimit.middleware");

router.get("/:vehicleNumber", protect, searchLimiter, getVehicleByNumber);

module.exports = router;