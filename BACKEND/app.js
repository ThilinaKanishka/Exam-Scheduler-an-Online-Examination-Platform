const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use("/", (req, res, next) => {
  res.send("It Is Working");
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => console.log(err));
