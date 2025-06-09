const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use("/", (req, res, next) => {
  res.send("It Is Working");
});

// Connect to MongoDB and start server
mongoose
  .connect("mongodb+srv://admin:123@cluster0.ra510.mongodb.net/", {
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
