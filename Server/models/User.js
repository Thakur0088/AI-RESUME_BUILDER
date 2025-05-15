const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add this field
});

const User = mongoose.model("User", userSchema);

module.exports = User;