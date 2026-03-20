const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name too long"],
    },
    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
      maxlength: [60, "Vehicle name too long"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Safe public object — never exposes password
userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    vehicleName: this.vehicleName,
    vehicleNumber: this.vehicleNumber,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
