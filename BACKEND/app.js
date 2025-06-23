const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const RegistrationRoutes = require("./Routes/RegistrationRoute");
const examinationRoutes = require("./Routes/ExaminationRoute");
const timetableRoutes = require("./Routes/TimetableRoute");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", RegistrationRoutes);
app.use("/api/exams", examinationRoutes);
app.use("/api/timetables", timetableRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
