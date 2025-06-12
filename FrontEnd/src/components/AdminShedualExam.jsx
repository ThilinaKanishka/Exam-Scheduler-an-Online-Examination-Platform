import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminScheduleExam = () => {
  const [examData, setExamData] = useState({
    moduleName: "",
    examName: "",
    examDate: "",
    examStartTime: "",
    examDuration: "",
    password: "",
    questionsToDisplay: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    questionType: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  const [examinations, setExaminations] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/examinations"
      );
      setExaminations(response.data.data);
    } catch (error) {
      console.error("Error fetching examinations:", error);
      alert("Error fetching examinations");
    }
  };

  const handleExamInputChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert("Please enter question text");
      return;
    }

    if (currentQuestion.questionType === "MCQ") {
      if (currentQuestion.options.some((opt) => !opt.trim())) {
        alert("Please fill all options for MCQ");
        return;
      }
    }

    if (!currentQuestion.correctAnswer.trim()) {
      alert("Please provide correct answer");
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      options:
        currentQuestion.questionType === "MCQ" ? currentQuestion.options : [],
    };

    setExamData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setCurrentQuestion({
      questionText: "",
      questionType: "MCQ",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 1,
    });
  };

  const removeQuestion = (index) => {
    setExamData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const createExamination = async () => {
    try {
      if (
        !examData.moduleName ||
        !examData.examName ||
        !examData.examDate ||
        !examData.examStartTime ||
        !examData.examDuration ||
        !examData.password ||
        !examData.questionsToDisplay
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (examData.questions.length === 0) {
        alert("Please add at least one question");
        return;
      }

      if (parseInt(examData.questionsToDisplay) > examData.questions.length) {
        alert("Questions to display cannot be more than total questions");
        return;
      }

      const examPayload = {
        ...examData,
        totalQuestions: examData.questions.length,
        examDuration: parseInt(examData.examDuration),
        questionsToDisplay: parseInt(examData.questionsToDisplay),
      };

      await axios.post("http://localhost:5000/api/examinations", examPayload);
      alert("Examination created successfully!");

      setExamData({
        moduleName: "",
        examName: "",
        examDate: "",
        examStartTime: "",
        examDuration: "",
        password: "",
        questionsToDisplay: "",
        questions: [],
      });

      fetchExaminations();
    } catch (error) {
      console.error("Error creating examination:", error);
      alert("Error creating examination");
    }
  };

  const deleteExamination = async (id) => {
    if (window.confirm("Are you sure you want to delete this examination?")) {
      try {
        await axios.delete(`http://localhost:5000/api/examinations/${id}`);
        alert("Examination deleted successfully!");
        fetchExaminations();
      } catch (error) {
        console.error("Error deleting examination:", error);
        alert("Error deleting examination");
      }
    }
  };

  const startEditingExam = (exam) => {
    setEditingExam(exam._id);
    setExamData({
      moduleName: exam.moduleName,
      examName: exam.examName,
      examDate: exam.examDate.split("T")[0],
      examStartTime: exam.examStartTime,
      examDuration: exam.examDuration.toString(),
      password: exam.password,
      questionsToDisplay: exam.questionsToDisplay.toString(),
      questions: exam.questions,
    });
  };

  const updateExamination = async () => {
    try {
      const examPayload = {
        ...examData,
        totalQuestions: examData.questions.length,
        examDuration: parseInt(examData.examDuration),
        questionsToDisplay: parseInt(examData.questionsToDisplay),
      };

      await axios.put(
        `http://localhost:5000/api/examinations/${editingExam}`,
        examPayload
      );
      alert("Examination updated successfully!");

      setEditingExam(null);
      setExamData({
        moduleName: "",
        examName: "",
        examDate: "",
        examStartTime: "",
        examDuration: "",
        password: "",
        questionsToDisplay: "",
        questions: [],
      });

      fetchExaminations();
    } catch (error) {
      console.error("Error updating examination:", error);
      alert("Error updating examination");
    }
  };

  const cancelEdit = () => {
    setEditingExam(null);
    setExamData({
      moduleName: "",
      examName: "",
      examDate: "",
      examStartTime: "",
      examDuration: "",
      password: "",
      questionsToDisplay: "",
      questions: [],
    });
  };

  return (
    <div>
      <h1>ExamSync - Admin Schedule Exam</h1>

      <div>
        <h2>{editingExam ? "Edit Examination" : "Create New Examination"}</h2>

        <div>
          <label>Module Name:</label>
          <input
            type="text"
            name="moduleName"
            value={examData.moduleName}
            onChange={handleExamInputChange}
            placeholder="Enter module name"
          />
        </div>

        <div>
          <label>Exam Name:</label>
          <input
            type="text"
            name="examName"
            value={examData.examName}
            onChange={handleExamInputChange}
            placeholder="Enter exam name"
          />
        </div>

        <div>
          <label>Exam Date:</label>
          <input
            type="date"
            name="examDate"
            value={examData.examDate}
            onChange={handleExamInputChange}
          />
        </div>

        <div>
          <label>Start Time:</label>
          <input
            type="time"
            name="examStartTime"
            value={examData.examStartTime}
            onChange={handleExamInputChange}
          />
        </div>

        <div>
          <label>Duration (minutes):</label>
          <input
            type="number"
            name="examDuration"
            value={examData.examDuration}
            onChange={handleExamInputChange}
            placeholder="Enter duration in minutes"
          />
        </div>

        <div>
          <label>Exam Password:</label>
          <input
            type="text"
            name="password"
            value={examData.password}
            onChange={handleExamInputChange}
            placeholder="Enter exam password"
          />
        </div>

        <div>
          <label>Questions to Display:</label>
          <input
            type="number"
            name="questionsToDisplay"
            value={examData.questionsToDisplay}
            onChange={handleExamInputChange}
            placeholder="Number of questions to show to student"
          />
        </div>

        <div>
          <h3>Add Question</h3>

          <div>
            <label>Question Type:</label>
            <select
              name="questionType"
              value={currentQuestion.questionType}
              onChange={handleQuestionInputChange}
            >
              <option value="MCQ">MCQ</option>
              <option value="Structured">Structured</option>
            </select>
          </div>

          <div>
            <label>Question Text:</label>
            <textarea
              name="questionText"
              value={currentQuestion.questionText}
              onChange={handleQuestionInputChange}
              placeholder="Enter question text"
              rows="3"
            />
          </div>

          {currentQuestion.questionType === "MCQ" && (
            <div>
              <label>Options:</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label>Correct Answer:</label>
            <input
              type="text"
              name="correctAnswer"
              value={currentQuestion.correctAnswer}
              onChange={handleQuestionInputChange}
              placeholder="Enter correct answer"
            />
          </div>

          <div>
            <label>Marks:</label>
            <input
              type="number"
              name="marks"
              value={currentQuestion.marks}
              onChange={handleQuestionInputChange}
              min="1"
            />
          </div>

          <button onClick={addQuestion}>Add Question</button>
        </div>

        <div>
          <h3>Questions Added ({examData.questions.length})</h3>
          {examData.questions.map((question, index) => (
            <div key={index}>
              <p>
                <strong>Q{index + 1}:</strong> {question.questionText}
              </p>
              <p>
                <strong>Type:</strong> {question.questionType}
              </p>
              <p>
                <strong>Marks:</strong> {question.marks}
              </p>
              <p>
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              {question.questionType === "MCQ" && (
                <div>
                  <strong>Options:</strong>
                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
              <hr />
            </div>
          ))}
        </div>

        <div>
          {editingExam ? (
            <div>
              <button onClick={updateExamination}>Update Examination</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <button onClick={createExamination}>Create Examination</button>
          )}
        </div>
      </div>

      <div>
        <h2>Existing Examinations</h2>
        {examinations.map((exam) => (
          <div key={exam._id}>
            <h3>{exam.examName}</h3>
            <p>
              <strong>Module:</strong> {exam.moduleName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(exam.examDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {exam.examStartTime}
            </p>
            <p>
              <strong>Duration:</strong> {exam.examDuration} minutes
            </p>
            <p>
              <strong>Total Questions:</strong> {exam.totalQuestions}
            </p>
            <p>
              <strong>Questions to Display:</strong> {exam.questionsToDisplay}
            </p>
            <p>
              <strong>Students Taken:</strong> {exam.results.length}
            </p>
            <div>
              <button onClick={() => startEditingExam(exam)}>Edit</button>
              <button onClick={() => deleteExamination(exam._id)}>
                Delete
              </button>
              <button
                onClick={() => (window.location.href = `/results/${exam._id}`)}
              >
                View Results
              </button>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminScheduleExam;
