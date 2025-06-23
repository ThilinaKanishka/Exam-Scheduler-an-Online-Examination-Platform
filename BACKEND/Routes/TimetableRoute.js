const express = require("express");
const router = express.Router();
const timetableController = require("../Controllers/TimetableController");

// Generate timetable
router.post("/generate", timetableController.generateTimetable);

// Get all timetables
router.get("/", timetableController.getAllTimetables);

// Get timetable by ID
router.get("/:id", timetableController.getTimetableById);

// Update timetable
router.put("/:id", timetableController.updateTimetable);

// Delete timetable
router.delete("/:id", timetableController.deleteTimetable);

// Get timetables by faculty and type
router.get(
  "/faculty/:faculty/:timetableType",
  timetableController.getTimetablesByFacultyAndType
);

module.exports = router;
