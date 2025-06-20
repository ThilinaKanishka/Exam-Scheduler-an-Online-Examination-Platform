import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Zoom,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import {
  AccessTime,
  CheckCircle,
  Assignment,
  School,
  Timer,
  QuestionAnswer,
  Send,
  ArrowBack,
  Numbers,
  Person,
  Fingerprint,
  Badge,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${pulse} 3s ease-in-out infinite`,
}));

const StudentExamPage = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { studentName, itNumber } = location.state || {};

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

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
        setTimeLeft(response.data.examDuration * 60);

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
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId, value) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setConfirmOpen(false);

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

  const calculateProgress = () => {
    const answered = Object.values(answers).filter((a) => a !== "").length;
    return (answered / questions.length) * 100;
  };

  if (!exam) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
          color: "white",
          py: 4,
          textAlign: "center",
          width: "100vw",
          pb: 4,
          boxShadow: theme.shadows[4],
          mb: 4,
        }}
      >
        <AnimatedBox>
          <School sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            ExamSync Campus
          </Typography>
          <Typography variant="h5" component="h2">
            ONLINE EXAMINATION PLATFORM
          </Typography>
        </AnimatedBox>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: isMobile ? 2 : 4 }}>
        {/* Enhanced Student Information Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(to right, #ffffff, #f5f7fa)",
            borderLeft: "6px solid #3f51b5",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                {exam.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: "#3f51b5" }}>
                      <Person sx={{ color: "white" }} />
                    </Avatar>
                  }
                  label={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {studentName}
                    </Typography>
                  }
                  sx={{
                    p: 1.5,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                  }}
                />

                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: "#2196f3" }}>
                      <Fingerprint sx={{ color: "white" }} />
                    </Avatar>
                  }
                  label={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {itNumber}
                    </Typography>
                  }
                  sx={{
                    p: 1.5,
                    bgcolor: "#e3f2fd",
                    borderRadius: 2,
                  }}
                />

                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: "#4caf50" }}>
                      <Badge sx={{ color: "white" }} />
                    </Avatar>
                  }
                  label={
                    <Typography variant="subtitle1" fontWeight="bold">
                      Exam ID: {examId}
                    </Typography>
                  }
                  sx={{
                    p: 1.5,
                    bgcolor: "#e8f5e9",
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: theme.palette.mode === "dark" ? "#333" : "#e3f2fd",
                p: 1.5,
                borderRadius: 2,
                minWidth: 150,
              }}
            >
              <AccessTime sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Box sx={{ width: "100%", bgcolor: "#e0e0e0", borderRadius: 5 }}>
              <Box
                sx={{
                  height: 10,
                  bgcolor: "primary.main",
                  borderRadius: 5,
                  width: `${calculateProgress()}%`,
                  transition: "width 0.5s ease",
                }}
              />
            </Box>
            <Typography variant="caption" color="textSecondary">
              {Object.values(answers).filter((a) => a !== "").length} of{" "}
              {questions.length} questions answered
            </Typography>
          </Box>
        </Paper>

        {submitted ? (
          <Slide direction="up" in={submitted} mountOnEnter unmountOnExit>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "#e8f5e9",
              }}
            >
              <CheckCircle
                sx={{ fontSize: 80, color: "success.main", mb: 2 }}
              />
              <Typography variant="h4" component="h2" gutterBottom>
                Exam Submitted Successfully!
              </Typography>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Your score: <strong>{score}</strong>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate("/")}
                size="large"
              >
                Return to Home
              </Button>
            </Paper>
          </Slide>
        ) : (
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={3}
          >
            {/* Questions Section */}
            <Box flex={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box id={`question-${activeQuestion}`}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    <Assignment sx={{ verticalAlign: "middle", mr: 1 }} />
                    Question {activeQuestion + 1} (
                    {questions[activeQuestion]?.marks} marks)
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {questions[activeQuestion]?.questionText}
                  </Typography>

                  {questions[activeQuestion]?.questionType === "mcq" ? (
                    <RadioGroup
                      value={answers[questions[activeQuestion]?._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          questions[activeQuestion]._id,
                          e.target.value
                        )
                      }
                    >
                      {questions[activeQuestion]?.options.map(
                        (option, optIndex) => (
                          <Fade in={true} timeout={500} key={optIndex}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                mb: 1,
                                cursor: "pointer",
                                "&:hover": {
                                  bgcolor: "#f5f5f5",
                                },
                                ...(answers[questions[activeQuestion]?._id] ===
                                  option && {
                                  bgcolor: "#e3f2fd",
                                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                                }),
                              }}
                              onClick={() =>
                                handleAnswerChange(
                                  questions[activeQuestion]._id,
                                  option
                                )
                              }
                            >
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                                sx={{ width: "100%", m: 0 }}
                              />
                            </Paper>
                          </Fade>
                        )
                      )}
                    </RadioGroup>
                  ) : (
                    <TextField
                      value={answers[questions[activeQuestion]?._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          questions[activeQuestion]._id,
                          e.target.value
                        )
                      }
                      multiline
                      rows={6}
                      fullWidth
                      variant="outlined"
                      placeholder="Type your answer here..."
                    />
                  )}
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={4}
                  flexWrap="wrap"
                  gap={2}
                >
                  <Button
                    variant="outlined"
                    disabled={activeQuestion === 0}
                    onClick={() =>
                      setActiveQuestion((prev) => Math.max(0, prev - 1))
                    }
                    startIcon={<ArrowBack />}
                  >
                    Previous
                  </Button>
                  <Box>
                    {activeQuestion < questions.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          setActiveQuestion((prev) =>
                            Math.min(questions.length - 1, prev + 1)
                          )
                        }
                        endIcon={<Send />}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => setConfirmOpen(true)}
                        endIcon={<Send />}
                        sx={{ px: 4 }}
                      >
                        Submit Exam
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* Question Navigation */}
            <Box
              flex={1}
              sx={{ position: isMobile ? "static" : "sticky", top: 20 }}
            >
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Numbers sx={{ mr: 1 }} /> Questions
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(auto-fill, minmax(50px, 1fr))"
                  gap={1}
                >
                  {questions.map((_, index) => (
                    <Zoom in={true} timeout={index * 100} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          bgcolor: answers[questions[index]._id]
                            ? theme.palette.success.light
                            : activeQuestion === index
                            ? theme.palette.primary.light
                            : "background.paper",
                          color:
                            activeQuestion === index
                              ? "primary.contrastText"
                              : "text.primary",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => setActiveQuestion(index)}
                      >
                        {index + 1}
                      </Paper>
                    </Zoom>
                  ))}
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <Box
                      component="span"
                      sx={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "success.light",
                          mr: 1,
                          borderRadius: "50%",
                        }}
                      />
                      Answered
                    </Box>
                  </Typography>
                  <Typography variant="subtitle2">
                    <Box
                      component="span"
                      sx={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "text.secondary",
                          mr: 1,
                          borderRadius: "50%",
                        }}
                      />
                      Unanswered
                    </Box>
                  </Typography>
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Timer sx={{ mr: 1 }} /> Time Remaining
                </Typography>
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: timeLeft < 300 ? "error.main" : "primary.main",
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Confirm Submission
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to submit your exam?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You have answered{" "}
            {Object.values(answers).filter((a) => a !== "").length} out of{" "}
            {questions.length} questions.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={<Send />}
          >
            Submit Exam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentExamPage;
