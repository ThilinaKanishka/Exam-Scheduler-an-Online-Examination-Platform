const Timetable = require("../Model/TimetableModel");
const { generateTimeSlots, getRandomDays } = require("./timetableUtils");

exports.generateTimetable = async (req, res) => {
  try {
    const { timetableType, faculty, semester, weekType, modules } = req.body;

    // Basic validation
    if (!timetableType || !faculty) {
      return res
        .status(400)
        .json({ error: "Timetable type and faculty are required" });
    }

    if (timetableType === "All Semester" && (!semester || !weekType)) {
      return res.status(400).json({
        error: "Semester and week type are required for semester timetables",
      });
    }

    if (!modules || modules.length < 4) {
      return res.status(400).json({ error: "At least 4 modules are required" });
    }

    // Clean and validate modules
    const cleanedModules = modules.map((module) => {
      const cleaned = {
        moduleName: module.moduleName,
        moduleCode: module.moduleCode,
        instructor: module.instructor,
        venue: module.venue,
      };

      // Only include examType for exam timetables
      if (timetableType !== "All Semester") {
        if (!module.examType) {
          throw new Error(
            "Exam type is required for all modules in exam timetables"
          );
        }
        cleaned.examType = module.examType;
      }

      return cleaned;
    });

    // Process modules based on timetable type
    let processedModules = [];

    if (timetableType === "All Semester") {
      const days =
        weekType === "WD"
          ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          : ["Saturday", "Sunday"];

      cleanedModules.forEach((module) => {
        const daysToAssign =
          weekType === "WD"
            ? getRandomDays(days, 1, 2)
            : [days[Math.floor(Math.random() * days.length)]];

        daysToAssign.forEach((day) => {
          const { startTime, endTime } = generateTimeSlots();
          processedModules.push({
            ...module,
            day,
            startTime,
            endTime,
          });
        });
      });
    } else {
      // Exam timetable - spread across 7 days
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

      cleanedModules.slice(0, 7).forEach((module, index) => {
        const day = shuffledDays[index % shuffledDays.length];
        const { startTime, endTime } = generateTimeSlots();
        processedModules.push({
          ...module,
          day,
          startTime,
          endTime,
        });
      });
    }

    // Create and save timetable
    const timetable = new Timetable({
      timetableType,
      faculty,
      semester: timetableType === "All Semester" ? semester : undefined,
      weekType: timetableType === "All Semester" ? weekType : undefined,
      modules: processedModules,
    });

    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    console.error("Timetable generation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Other controller methods remain unchanged...
exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ generatedAt: -1 });
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.updateTimetable = async (req, res) => {
  try {
    const { modules } = req.body;

    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    if (modules) {
      timetable.modules = modules;
    }

    await timetable.save();
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
