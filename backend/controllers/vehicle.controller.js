const User = require("../models/User");

const VEHICLE_NUMBER_REGEX = /^[A-Z0-9]{4,15}$/;

// ── GET /vehicles/:vehicleNumber ──────────────────────────────────────────────
const getVehicleByNumber = async (req, res, next) => {
  try {
    const vnum = req.params.vehicleNumber.toUpperCase().trim();

    if (!VEHICLE_NUMBER_REGEX.test(vnum)) {
      return res.status(400).json({ message: "Invalid vehicle number format" });
    }

    const user = await User.findOne({ vehicleNumber: vnum });
    if (!user) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({
      ownerId: user._id,
      ownerName: user.name,
      vehicleName: user.vehicleName,
      vehicleNumber: user.vehicleNumber,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVehicleByNumber };
