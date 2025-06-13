import React, { useState } from "react";
import axios from "axios";

const AdminScheduleExam = () => {
  const [examData, setExamData] = useState({
    moduleName: "",
    examName: "",
    examPassword: "",
    examDuration: 60,
    scheduledDate: "",
    questionsToShow: 20,
    questions: [
      {
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const { value } = e.target;
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setExamData({
      ...examData,
      questions: [
        ...examData.questions,
        {
          questionText: "",
          questionType: "mcq",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions.splice(index, 1);
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/exams/exams",
        examData
      );
      alert("Exam scheduled successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error scheduling exam:", error);
      alert("Failed to schedule exam");
    }
  };

  return (
    <div>
      <h1>Schedule New Exam</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Module Name:</label>
          <input
            type="text"
            name="moduleName"
            value={examData.moduleName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Exam Name:</label>
          <input
            type="text"
            name="examName"
            value={examData.examName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Exam Password:</label>
          <input
            type="password"
            name="examPassword"
            value={examData.examPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Duration (minutes):</label>
          <input
            type="number"
            name="examDuration"
            value={examData.examDuration}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Scheduled Date:</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={examData.scheduledDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Questions to Show:</label>
          <input
            type="number"
            name="questionsToShow"
            value={examData.questionsToShow}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Questions</h2>
        {examData.questions.map((question, qIndex) => (
          <div key={qIndex}>
            <h3>Question {qIndex + 1}</h3>
            <div>
              <label>Question Text:</label>
              <input
                type="text"
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
            </div>
            <div>
              <label>Question Type:</label>
              <select
                name="questionType"
                value={question.questionType}
                onChange={(e) => handleQuestionChange(qIndex, e)}
              >
                <option value="mcq">MCQ</option>
                <option value="structured">Structured</option>
              </select>
            </div>
            <div>
              <label>Marks:</label>
              <input
                type="number"
                name="marks"
                value={question.marks}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                required
              />
            </div>
            {question.questionType === "mcq" && (
              <div>
                <h4>Options</h4>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex}>
                    <label>Option {oIndex + 1}:</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                      required
                    />
                  </div>
                ))}
                <div>
                  <label>Correct Answer:</label>
                  <select
                    name="correctAnswer"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, e)}
                    required
                  >
                    <option value="">Select correct option</option>
                    {question.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>
                        Option {oIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button type="button" onClick={() => removeQuestion(qIndex)}>
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Schedule Exam</button>
      </form>
    </div>
  );
};

export default AdminScheduleExam;
