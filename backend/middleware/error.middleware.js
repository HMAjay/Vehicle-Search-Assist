const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages[0] });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const label = field === "vehicleNumber" ? "Vehicle number" : "Email";
    return res.status(400).json({ message: `${label} is already registered` });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

module.exports = { errorHandler };
