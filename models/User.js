const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Seller"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["SELLER"],
    default: "SELLER"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
