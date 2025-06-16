import React, { useState } from "react";
import axios from "axios";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  Slide,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import {
  AddCircleOutline,
  DeleteOutline,
  Edit,
  Save,
  Cancel,
  Schedule,
  Quiz,
  Lock,
  List,
  Visibility,
  Event,
  AccessTime,
  CheckCircle,
  CalendarToday,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { keyframes } from "@emotion/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Color scheme
const colors = {
  primary: "#4a148c",
  secondary: "#ff6f00",
  background: "#f5f5f5",
  paper: "#ffffff",
  text: "#333333",
  accent: "#7b1fa2",
  success: "#2e7d32",
  error: "#d32f2f",
  info: "#0288d1",
};

// Custom styled components
const AnimatedContainer = styled(Container)(({ theme }) => ({
  backgroundColor: colors.background,
  padding: theme.spacing(4),
  minHeight: "100vh",
  transition: "all 0.3s ease",
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: colors.primary,
  color: "white",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: `0 4px 20px 0 rgba(0,0,0,0.12)`,
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: `0 2px 10px 0 rgba(0,0,0,0.08)`,
  marginBottom: theme.spacing(4),
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderLeft: `4px solid ${colors.accent}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 12px 0 rgba(0,0,0,0.1)`,
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.primary,
  color: "white",
  "&:hover": {
    backgroundColor: colors.accent,
  },
  margin: theme.spacing(1),
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.secondary,
  color: "white",
  "&:hover": {
    backgroundColor: "#e65100",
  },
  margin: theme.spacing(1),
}));

const CorrectOptionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(46, 125, 50, 0.1)",
  border: `1px solid ${colors.success}`,
  color: colors.success,
  fontWeight: "bold",
  "& .MuiChip-icon": {
    color: colors.success,
  },
}));

const OptionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const DateTimeWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: "rgba(2, 136, 209, 0.05)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${colors.info}`,
  marginBottom: theme.spacing(3),
  "& .MuiInputBase-root": {
    backgroundColor: "white",
  },
}));

const DateTimeHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  "& svg": {
    color: colors.info,
  },
}));

const OptionsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const AdminScheduleExam = () => {
  const [examData, setExamData] = useState({
    moduleName: "",
    examName: "",
    examPassword: "",
    examDuration: 60,
    scheduledDate: null,
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({ ...examData, [name]: value });
  };

  const handleDateChange = (date) => {
    setExamData({ ...examData, scheduledDate: date });
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

  const handleCorrectAnswerChange = (qIndex, option) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].correctAnswer = option;
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

  const confirmDeleteQuestion = (index) => {
    setQuestionToDelete(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteQuestion = () => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions.splice(questionToDelete, 1);
    setExamData({ ...examData, questions: updatedQuestions });
    if (editingQuestionIndex === questionToDelete) {
      setEditingQuestionIndex(null);
      setEditMode(false);
    }
    setOpenDeleteDialog(false);
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
    <div style={{ backgroundColor: colors.background }}>
      <AdminHeader />
      <AnimatedContainer maxWidth="lg">
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <HeaderPaper elevation={6}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Quiz fontSize="large" />
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h1">
                  Schedule New Exam
                </Typography>
              </Grid>
            </Grid>
          </HeaderPaper>
        </Slide>

        {!showExamList ? (
          <Fade in={true}>
            <FormPaper elevation={2}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Module Name"
                      name="moduleName"
                      value={examData.moduleName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <List color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Exam Name"
                      name="examName"
                      value={examData.examName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Quiz color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Exam Password"
                      name="examPassword"
                      type="password"
                      value={examData.examPassword}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Lock color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Duration (minutes)"
                      name="examDuration"
                      type="number"
                      value={examData.examDuration}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DateTimeWrapper>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label="Exam Date & Time"
                          value={examData.scheduledDate}
                          onChange={handleDateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              required
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <CalendarToday
                                    color="primary"
                                    sx={{ mr: 1 }}
                                  />
                                ),
                              }}
                            />
                          )}
                          minDateTime={new Date()}
                          minutesStep={5}
                        />
                      </LocalizationProvider>
                    </DateTimeWrapper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Questions to Show"
                      name="questionsToShow"
                      type="number"
                      value={examData.questionsToShow}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Questions
                </Typography>

                {examData.questions.map((question, qIndex) => (
                  <Zoom in={true} key={qIndex}>
                    <QuestionCard>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: colors.accent }}
                        >
                          Question {qIndex + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Question Text"
                              name="questionText"
                              value={question.questionText}
                              onChange={(e) => handleQuestionChange(qIndex, e)}
                              required
                              multiline
                              rows={2}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Question Type</InputLabel>
                              <Select
                                name="questionType"
                                value={question.questionType}
                                onChange={(e) =>
                                  handleQuestionChange(qIndex, e)
                                }
                                label="Question Type"
                              >
                                <MenuItem value="mcq">Multiple Choice</MenuItem>
                                <MenuItem value="structured">
                                  Structured
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Marks"
                              name="marks"
                              type="number"
                              value={question.marks}
                              onChange={(e) => handleQuestionChange(qIndex, e)}
                              required
                            />
                          </Grid>

                          {question.questionType === "mcq" && (
                            <>
                              <Grid item xs={12}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ mt: 1, mb: 1 }}
                                >
                                  Options
                                </Typography>
                              </Grid>
                              {question.options.map((option, oIndex) => (
                                <Grid item xs={12} sm={6} key={oIndex}>
                                  <TextField
                                    fullWidth
                                    label={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                      handleOptionChange(qIndex, oIndex, e)
                                    }
                                    required
                                  />
                                </Grid>
                              ))}
                              <Grid item xs={12}>
                                <OptionsContainer>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                      Select Correct Answer
                                    </FormLabel>
                                    <RadioGroup
                                      value={question.correctAnswer}
                                      onChange={(e) =>
                                        handleCorrectAnswerChange(
                                          qIndex,
                                          e.target.value
                                        )
                                      }
                                    >
                                      {question.options.map(
                                        (option, oIndex) => (
                                          <FormControlLabel
                                            key={oIndex}
                                            value={option}
                                            control={<Radio color="primary" />}
                                            label={`Option ${
                                              oIndex + 1
                                            }: ${option}`}
                                            disabled={!option.trim()}
                                          />
                                        )
                                      )}
                                    </RadioGroup>
                                  </FormControl>
                                </OptionsContainer>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <IconButton
                          color="error"
                          onClick={() => confirmDeleteQuestion(qIndex)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </CardActions>
                    </QuestionCard>
                  </Zoom>
                ))}

                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutline />}
                    onClick={addQuestion}
                    sx={{ mr: 2 }}
                  >
                    Add Question
                  </Button>
                  <PrimaryButton
                    variant="contained"
                    type="submit"
                    startIcon={<Save />}
                  >
                    Schedule Exam
                  </PrimaryButton>
                </Grid>
              </form>
            </FormPaper>
          </Fade>
        ) : (
          <Fade in={true}>
            <div style={{ marginTop: "40px" }}>
              <Paper
                elevation={2}
                sx={{
                  padding: 3,
                  mb: 4,
                  backgroundColor: colors.paper,
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Grid item>
                    <Typography variant="h4" sx={{ color: colors.primary }}>
                      <Visibility sx={{ mr: 1, verticalAlign: "middle" }} />
                      Scheduled Exam Details
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SecondaryButton
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setShowExamList(false)}
                    >
                      Edit Exam
                    </SecondaryButton>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Exam Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Module Name:</strong> {examData.moduleName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Exam Name:</strong> {examData.examName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Duration:</strong> {examData.examDuration} minutes
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Scheduled Date:</strong>{" "}
                      {examData.scheduledDate?.toLocaleString() || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Questions to Show:</strong>{" "}
                      {examData.questionsToShow}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Questions
              </Typography>
              <Grid container spacing={3}>
                {examData.questions.map((question, index) => (
                  <Grid item xs={12} key={index}>
                    <QuestionCard>
                      <CardContent>
                        {editMode && editingQuestionIndex === index ? (
                          <div>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Question Text"
                                  name="questionText"
                                  value={question.questionText}
                                  onChange={(e) =>
                                    handleQuestionChange(index, e)
                                  }
                                  required
                                  multiline
                                  rows={2}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                  <InputLabel>Question Type</InputLabel>
                                  <Select
                                    name="questionType"
                                    value={question.questionType}
                                    onChange={(e) =>
                                      handleQuestionChange(index, e)
                                    }
                                    label="Question Type"
                                  >
                                    <MenuItem value="mcq">
                                      Multiple Choice
                                    </MenuItem>
                                    <MenuItem value="structured">
                                      Structured
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Marks"
                                  name="marks"
                                  type="number"
                                  value={question.marks}
                                  onChange={(e) =>
                                    handleQuestionChange(index, e)
                                  }
                                  required
                                />
                              </Grid>
                              {question.questionType === "mcq" && (
                                <>
                                  <Grid item xs={12}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ mt: 1, mb: 1 }}
                                    >
                                      Options
                                    </Typography>
                                  </Grid>
                                  {question.options.map((option, oIndex) => (
                                    <Grid item xs={12} sm={6} key={oIndex}>
                                      <TextField
                                        fullWidth
                                        label={`Option ${oIndex + 1}`}
                                        value={option}
                                        onChange={(e) =>
                                          handleOptionChange(index, oIndex, e)
                                        }
                                        required
                                      />
                                    </Grid>
                                  ))}
                                  <Grid item xs={12}>
                                    <OptionsContainer>
                                      <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                          Select Correct Answer
                                        </FormLabel>
                                        <RadioGroup
                                          value={question.correctAnswer}
                                          onChange={(e) =>
                                            handleCorrectAnswerChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        >
                                          {question.options.map(
                                            (option, oIndex) => (
                                              <FormControlLabel
                                                key={oIndex}
                                                value={option}
                                                control={
                                                  <Radio color="primary" />
                                                }
                                                label={`Option ${
                                                  oIndex + 1
                                                }: ${option}`}
                                                disabled={!option.trim()}
                                              />
                                            )
                                          )}
                                        </RadioGroup>
                                      </FormControl>
                                    </OptionsContainer>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                            <CardActions sx={{ justifyContent: "flex-end" }}>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<Save />}
                                onClick={saveEditedQuestion}
                                sx={{ mr: 1 }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={cancelEditing}
                              >
                                Cancel
                              </Button>
                            </CardActions>
                          </div>
                        ) : (
                          <div>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grid item>
                                <Typography
                                  variant="h6"
                                  sx={{ color: colors.accent }}
                                >
                                  Question {index + 1}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <IconButton
                                  color="primary"
                                  onClick={() => startEditingQuestion(index)}
                                  sx={{ mr: 1 }}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => confirmDeleteQuestion(index)}
                                >
                                  <DeleteOutline />
                                </IconButton>
                              </Grid>
                            </Grid>
                            <Typography paragraph sx={{ mt: 1 }}>
                              {question.questionText}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={3}>
                                <Typography>
                                  <strong>Type:</strong> {question.questionType}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} sm={3}>
                                <Typography>
                                  <strong>Marks:</strong> {question.marks}
                                </Typography>
                              </Grid>
                            </Grid>
                            {question.questionType === "mcq" && (
                              <div>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ mt: 2, mb: 1 }}
                                >
                                  <strong>Options:</strong>
                                </Typography>
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  spacing={1}
                                >
                                  {question.options.map((option, oIndex) =>
                                    option === question.correctAnswer ? (
                                      <CorrectOptionChip
                                        key={oIndex}
                                        label={`${option}`}
                                        icon={<CheckCircle />}
                                      />
                                    ) : (
                                      <OptionChip
                                        key={oIndex}
                                        label={`Option ${
                                          oIndex + 1
                                        }: ${option}`}
                                        variant="outlined"
                                      />
                                    )
                                  )}
                                </Stack>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </QuestionCard>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Fade>
        )}

        {/* Delete confirmation dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this question?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteQuestion}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </AnimatedContainer>
      <AdminFooter />
    </div>
  );
};

export default AdminScheduleExam;
