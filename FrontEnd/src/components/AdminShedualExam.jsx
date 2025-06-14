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
  const [showExamList, setShowExamList] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);

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
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setEditMode(false);
    }
  };

  const startEditingQuestion = (index) => {
    setEditingQuestionIndex(index);
    setEditMode(true);
  };

  const cancelEditing = () => {
    setEditingQuestionIndex(null);
    setEditMode(false);
  };

  const saveEditedQuestion = () => {
    setEditingQuestionIndex(null);
    setEditMode(false);
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
      setShowExamList(true);
    } catch (error) {
      console.error("Error scheduling exam:", error);
      alert("Failed to schedule exam");
    }
  };

  return (
    <div>
      <h1>Schedule New Exam</h1>
      {!showExamList ? (
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
      ) : (
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Scheduled Exam Details</h2>
            <button onClick={() => setShowExamList(false)}>Edit Exam</button>
          </div>

          <div>
            <h3>Exam Information</h3>
            <p>
              <strong>Module Name:</strong> {examData.moduleName}
            </p>
            <p>
              <strong>Exam Name:</strong> {examData.examName}
            </p>
            <p>
              <strong>Duration:</strong> {examData.examDuration} minutes
            </p>
            <p>
              <strong>Scheduled Date:</strong>{" "}
              {new Date(examData.scheduledDate).toLocaleString()}
            </p>
            <p>
              <strong>Questions to Show:</strong> {examData.questionsToShow}
            </p>
          </div>

          <h3>Questions</h3>
          <ol>
            {examData.questions.map((question, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                {editMode && editingQuestionIndex === index ? (
                  <div>
                    <div>
                      <label>Question Text:</label>
                      <input
                        type="text"
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, e)}
                        required
                      />
                    </div>
                    <div>
                      <label>Question Type:</label>
                      <select
                        name="questionType"
                        value={question.questionType}
                        onChange={(e) => handleQuestionChange(index, e)}
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
                        onChange={(e) => handleQuestionChange(index, e)}
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
                              onChange={(e) =>
                                handleOptionChange(index, oIndex, e)
                              }
                              required
                            />
                          </div>
                        ))}
                        <div>
                          <label>Correct Answer:</label>
                          <select
                            name="correctAnswer"
                            value={question.correctAnswer}
                            onChange={(e) => handleQuestionChange(index, e)}
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
                    <button onClick={saveEditedQuestion}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        <strong>Question {index + 1}:</strong>{" "}
                        {question.questionText}
                      </p>
                      <div>
                        <button onClick={() => startEditingQuestion(index)}>
                          Edit
                        </button>
                        <button onClick={() => removeQuestion(index)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>
                      <strong>Type:</strong> {question.questionType}
                    </p>
                    <p>
                      <strong>Marks:</strong> {question.marks}
                    </p>
                    {question.questionType === "mcq" && (
                      <div>
                        <p>
                          <strong>Options:</strong>
                        </p>
                        <ul>
                          {question.options.map((option, oIndex) => (
                            <li key={oIndex}>
                              {option}{" "}
                              {option === question.correctAnswer &&
                                "(Correct Answer)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default AdminScheduleExam;
