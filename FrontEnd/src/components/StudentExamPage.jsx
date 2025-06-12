import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
} from "@mui/material";

const StudentExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, itNumber, examId, duration } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [examSubmitted, setExamSubmitted] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/exam-details");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/examinations/${examId}/student-questions`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [examId, location.state, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 && !examSubmitted) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examSubmitted]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (examSubmitted) return;

    try {
      const answersArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
      }));

      await axios.post(
        `http://localhost:5000/api/examinations/${examId}/results`,
        {
          studentName,
          itNumber,
          answers: answersArray,
        }
      );

      setExamSubmitted(true);
      alert("Exam submitted successfully!");
      navigate("/exam-details");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questions.length === 0) {
    return <Typography>Loading questions...</Typography>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">
          {studentName} - {itNumber}
        </Typography>
        <Typography variant="h5">Time Left: {formatTime(timeLeft)}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentQuestion.questionText}
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Your Answer:</FormLabel>
              <RadioGroup
                value={answers[currentQuestion._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion._id, e.target.value)
                }
              >
                {currentQuestion.options?.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="contained"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button variant="contained" onClick={handleNextQuestion}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitExam}
                >
                  Submit Exam
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Questions
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestionIndex === index ? "contained" : "outlined"
                  }
                  onClick={() => setCurrentQuestionIndex(index)}
                  sx={{ minWidth: 40, height: 40 }}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Answered: {Object.keys(answers).length}/{questions.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentExamPage;
