const Examination = require("../Model/ExaminationModel");

exports.createExam = async (req, res) => {
  try {
    const exam = new Examination(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExam = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    res.json(exam);
  } catch (error) {
    res.status(404).json({ error: "Exam not found" });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { examId, studentName, itNumber, answers } = req.body;
    const exam = await Examination.findById(examId);

    let totalMarks = 0;
    const questions = exam.questions.slice(0, exam.questionsToDisplay);

    answers.forEach((ans, i) => {
      if (ans === questions[i].correctAnswer) {
        totalMarks += questions[i].marks;
      }
    });

    exam.results.push({ studentName, itNumber, answers, totalMarks });
    await exam.save();
    res.status(200).json({ totalMarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const exam = await Examination.findById(req.params.id);
    res.json(exam.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
