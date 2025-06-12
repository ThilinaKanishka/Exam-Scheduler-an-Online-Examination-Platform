const Examination = require("../Model/ExaminationModel");

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const exam = new Examination(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Examination.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update exam
exports.updateExam = async (req, res) => {
  try {
    const exam = await Examination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete exam
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Examination.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add question to exam
exports.addQuestion = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.questions.push(req.body);
    exam.totalQuestions = exam.questions.length;
    await exam.save();

    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const question = exam.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.set(req.body);
    await exam.save();

    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.questions.id(req.params.questionId).remove();
    exam.totalQuestions = exam.questions.length;
    await exam.save();

    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit exam results
exports.submitResults = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const { studentName, itNumber, answers } = req.body;
    let totalMarks = 0;

    const evaluatedAnswers = answers.map((answer) => {
      const question = exam.questions.id(answer.questionId);
      const isCorrect = question.correctAnswer === answer.answer;
      const marksObtained = isCorrect ? question.marks : 0;
      totalMarks += marksObtained;

      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
        marksObtained,
      };
    });

    exam.results.push({
      studentName,
      itNumber,
      answers: evaluatedAnswers,
      totalMarks,
    });

    await exam.save();
    res.status(201).json({ message: "Results submitted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get exam results
exports.getResults = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(exam.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify exam password
exports.verifyPassword = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.password !== req.body.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get random questions for student
exports.getStudentQuestions = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const shuffledQuestions = [...exam.questions].sort(
      () => 0.5 - Math.random()
    );
    const selectedQuestions = shuffledQuestions.slice(
      0,
      exam.questionsToDisplay
    );

    const questionsForStudent = selectedQuestions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    }));

    res.status(200).json(questionsForStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
