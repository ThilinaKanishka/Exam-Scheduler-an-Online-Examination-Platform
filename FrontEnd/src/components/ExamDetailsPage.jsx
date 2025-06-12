import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

const ExamDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    itNumber: "",
    password: "",
  });
  const [exam, setExam] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const examId = location.state?.examId;

  useEffect(() => {
    if (!examId) {
      navigate("/schedule-exam");
    } else {
      fetchExamDetails();
    }
  }, [examId, navigate]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/examinations/${examId}`
      );
      setExam(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load exam details");
      setLoading(false);
      console.error("Error fetching exam:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Verify password
      await axios.post(
        `http://localhost:5000/api/examinations/${examId}/verify-password`,
        {
          password: formData.password,
        }
      );

      // Navigate to exam page
      navigate(`/student-exam/${examId}`, {
        state: {
          studentName: formData.studentName,
          itNumber: formData.itNumber,
          examId: examId,
          duration: exam.duration,
        },
      });
    } catch (error) {
      setError("Invalid exam password. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box sx={{ padding: 3, textAlign: "center" }}>
        <Typography variant="h6">No exam selected</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/schedule-exam")}
          sx={{ mt: 2 }}
        >
          Back to Exams
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Exam Login
          </Typography>

          <Typography variant="h6" gutterBottom align="center">
            {exam.moduleName} - {exam.examName}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Full Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="IT Number"
                name="itNumber"
                value={formData.itNumber}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Exam Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Duration:</strong> {exam.duration} minutes
                </Typography>
                <Typography variant="body2">
                  <strong>Questions:</strong> {exam.questionsToDisplay} out of{" "}
                  {exam.totalQuestions}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Start Exam
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExamDetailsPage;
