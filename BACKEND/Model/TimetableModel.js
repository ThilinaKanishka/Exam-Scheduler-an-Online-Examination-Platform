const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  timetableType: {
    type: String,
    required: true,
    enum: [
      "All Semester",
      "MID Exam",
      "Final Exam",
      "Peapeat-MID",
      "Peapeat-Final",
    ],
  },
  faculty: {
    type: String,
    required: true,
    enum: ["computing", "engineering", "business", "nursing"],
  },
  semester: {
    type: String,
    required: function () {
      return this.timetableType === "All Semester";
    },
    enum: ["Y1S1", "Y1S2", "Y2S1", "Y2S2", "Y3S1", "Y3S2", "Y4S1", "Y4S2"],
  },
  weekType: {
    type: String,
    required: function () {
      return this.timetableType === "All Semester";
    },
    enum: ["WD", "WE"],
  },
  modules: [
    {
      moduleName: { type: String, required: true },
      moduleCode: { type: String, required: true },
      instructor: { type: String, required: true },
      venue: { type: String, required: true },
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      examType: {
        type: String,
        enum: ["physics", "computer base"],
        required: function () {
          return this.parent().timetableType !== "All Semester";
        },
      },
    },
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

timetableSchema.pre("save", function (next) {
  const timetable = this;

  // Validate exam types for exam timetables
  if (timetable.timetableType !== "All Semester") {
    for (const module of timetable.modules) {
      if (!module.examType) {
        return next(
          new Error(
            `Exam type is required for all modules in ${timetable.timetableType} timetables`
          )
        );
      }
    }
  }

  // Check for overlapping schedules
  for (let i = 0; i < timetable.modules.length; i++) {
    for (let j = i + 1; j < timetable.modules.length; j++) {
      const mod1 = timetable.modules[i];
      const mod2 = timetable.modules[j];

      if (mod1.venue === mod2.venue && mod1.day === mod2.day) {
        if (mod1.startTime < mod2.endTime && mod1.endTime > mod2.startTime) {
          return next(
            new Error(`Double booking at ${mod1.venue} on ${mod1.day}`)
          );
        }
      }
    }
  }

  next();
});

module.exports = mongoose.model("Timetable", timetableSchema);
