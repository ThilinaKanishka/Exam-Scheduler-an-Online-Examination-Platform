// Models/RegistrationModel.js
const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", RegistrationSchema);
