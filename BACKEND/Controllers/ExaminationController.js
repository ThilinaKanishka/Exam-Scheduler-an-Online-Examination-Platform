const { Exam, Result } = require("../Model/ExaminationModel");

// Schedule a new exam
exports.scheduleExam = async (req, res) => {
  try {
    const {
      moduleName,
      examName,
      examPassword,
      examDuration,
      scheduledDate,
      questions,
      questionsToShow,
    } = req.body;

    const newExam = new Exam({
      moduleName,
      examName,
      examPassword,
      examDuration,
      scheduledDate,
      questions,
      questionsToShow,
    });

    await newExam.save();
    res
      .status(201)
      .json({ message: "Exam scheduled successfully", exam: newExam });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error scheduling exam", error: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().select("-questions -examPassword");
    res.status(200).json(exams);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exams", error: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exam", error: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res
      .status(200)
      .json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating exam", error: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exam", error: error.message });
  }
};

// Verify exam password
exports.verifyExamPassword = async (req, res) => {
  try {
    const { examId, password } = req.body;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.examPassword !== password) {
      return res.status(401).json({ message: "Invalid exam password" });
    }

    res.status(200).json({
      message: "Password verified",
      exam: { _id: exam._id, examName: exam.examName },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying password", error: error.message });
  }
};

// Get exam questions for student
exports.getExamQuestions = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Shuffle questions and select the required number
    const shuffledQuestions = [...exam.questions].sort(
      () => 0.5 - Math.random()
    );
    const selectedQuestions = shuffledQuestions.slice(0, exam.questionsToShow);

    res.status(200).json({
      examName: exam.examName,
      examDuration: exam.examDuration,
      questions: selectedQuestions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        marks: q.marks,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching questions", error: error.message });
  }
};

// Submit exam answers
exports.submitExam = async (req, res) => {
  try {
    const { examId, studentName, itNumber, answers } = req.body;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Calculate score
    let score = 0;
    answers.forEach((answer) => {
      const question = exam.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question && answer.selectedAnswer === question.correctAnswer) {
        score += question.marks;
      }
    });

    // Save result
    const newResult = new Result({
      examId,
      studentName,
      itNumber,
      answers,
      score,
    });

    await newResult.save();
    res.status(201).json({ message: "Exam submitted successfully", score });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting exam", error: error.message });
  }
};

// Get exam results
exports.getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .select("studentName itNumber score submittedAt")
      .sort({ score: -1 });

    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: error.message });
  }
};
