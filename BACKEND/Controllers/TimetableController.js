const Timetable = require("../Model/TimetableModel");
const {
  generateRandomTime,
  getRandomDays,
} = require("../Controllers/timetableUtils");

// Generate timetable
exports.generateTimetable = async (req, res) => {
  try {
    const { timetableType, faculty, semester, weekType, examType, modules } =
      req.body;

    if (!timetableType || !faculty) {
      return res
        .status(400)
        .json({ error: "Timetable type and faculty are required" });
    }

    if (timetableType === "All Semester" && (!semester || !weekType)) {
      return res.status(400).json({
        error: "Semester and week type are required for All Semester timetable",
      });
    }

    if (timetableType !== "All Semester" && !examType) {
      return res
        .status(400)
        .json({ error: "Exam type is required for exam timetables" });
    }

    if (!modules || modules.length < 4) {
      return res.status(400).json({ error: "At least 4 modules are required" });
    }

    // Process modules based on timetable type
    let processedModules = [];

    if (timetableType === "All Semester") {
      if (weekType === "WD") {
        // Weekday timetable - spread across 5 days
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        modules.forEach((module) => {
          // Assign 1-2 random days per module
          const moduleDays = getRandomDays(days, 1, 2);

          moduleDays.forEach((day) => {
            const { startTime, endTime } = generateRandomTime("08:00", "20:00");
            processedModules.push({
              ...module,
              day,
              startTime,
              endTime,
            });
          });
        });
      } else {
        // Weekend timetable - only Saturday and Sunday
        modules.forEach((module) => {
          const day = Math.random() > 0.5 ? "Saturday" : "Sunday";
          const { startTime, endTime } = generateRandomTime("08:00", "20:00");
          processedModules.push({
            ...module,
            day,
            startTime,
            endTime,
          });
        });
      }
    } else {
      // Exam timetable - spread across 7 days, one module per day
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const shuffledDays = [...days].sort(() => 0.5 - Math.random());

      modules.slice(0, 7).forEach((module, index) => {
        const day = shuffledDays[index % shuffledDays.length];
        const { startTime, endTime } = generateRandomTime("08:00", "20:00");
        processedModules.push({
          ...module,
          day,
          startTime,
          endTime,
        });
      });
    }

    // Create new timetable
    const timetable = new Timetable({
      timetableType,
      faculty,
      semester: timetableType === "All Semester" ? semester : undefined,
      weekType: timetableType === "All Semester" ? weekType : undefined,
      examType: timetableType !== "All Semester" ? examType : undefined,
      modules: processedModules,
    });

    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    console.error("Error generating timetable:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all timetables
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ generatedAt: -1 });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { modules } = req.body;

    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    // Update modules
    if (modules) {
      timetable.modules = modules;
    }

    await timetable.save();
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }
    res.json({ message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get timetables by faculty and type
exports.getTimetablesByFacultyAndType = async (req, res) => {
  try {
    const { faculty, timetableType } = req.params;

    const query = { faculty };
    if (timetableType !== "All") {
      query.timetableType = timetableType;
    }

    const timetables = await Timetable.find(query).sort({ generatedAt: -1 });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
