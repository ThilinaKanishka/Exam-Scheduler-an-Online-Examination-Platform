// Routes/RegistrationRoute.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../Controllers/RegistrationController");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
