import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const StudentExamPage = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, itNumber } = location.state || {};

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!studentName || !itNumber) {
      navigate("/exam-login");
      return;
    }

    const fetchExam = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/exams/exams/${examId}/questions`
        );
        setExam({
          name: response.data.examName,
          duration: response.data.examDuration,
        });
        setQuestions(response.data.questions);
        setTimeLeft(response.data.examDuration * 60); // Convert minutes to seconds

        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach((question) => {
          initialAnswers[question._id] = "";
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Error fetching exam:", error);
        navigate("/exam-login");
      }
    };

    fetchExam();
  }, [examId, navigate, studentName, itNumber]);

  useEffect(() => {
    // Don't start timer if exam is already submitted
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]); // Added submitted to dependencies

  const handleAnswerChange = (questionId, value) => {
    if (submitted) return; // Prevent changes after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    try {
      const answersArray = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const response = await axios.post(
        "http://localhost:5000/api/exams/exams/submit",
        {
          examId,
          studentName,
          itNumber,
          answers: answersArray,
        }
      );

      setSubmitted(true);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div>
      <h1>{exam.name}</h1>
      <div>Time Left: {formatTime(timeLeft)}</div>

      {submitted ? (
        <div>
          <h2>Exam Submitted Successfully!</h2>
          <p>Your score: {score}</p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 3 }}>
              {questions.map((question, index) => (
                <div key={question._id} style={{ marginBottom: "20px" }}>
                  <h3>
                    Question {index + 1} ({question.marks} marks)
                  </h3>
                  <p>{question.questionText}</p>

                  {question.questionType === "mcq" ? (
                    <div>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex}>
                          <label>
                            <input
                              type="radio"
                              name={`question_${question._id}`}
                              value={option}
                              checked={answers[question._id] === option}
                              onChange={() =>
                                handleAnswerChange(question._id, option)
                              }
                              disabled={submitted}
                            />
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                      rows={4}
                      style={{ width: "100%" }}
                      disabled={submitted}
                    />
                  )}
                </div>
              ))}
              <button onClick={handleSubmit} disabled={submitted}>
                Submit Exam
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <h3>Questions</h3>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {questions.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "1px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "5px",
                      cursor: "pointer",
                      backgroundColor: answers[questions[index]._id]
                        ? "#4CAF50"
                        : "#fff",
                    }}
                    onClick={() => {
                      document
                        .getElementById(`question-${index}`)
                        ?.scrollIntoView();
                    }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentExamPage;
