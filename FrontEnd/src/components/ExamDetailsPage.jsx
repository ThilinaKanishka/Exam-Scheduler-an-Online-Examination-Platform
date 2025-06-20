import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";
import {
  AccessTime as ClockIcon,
  Warning as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Person as UserIcon,
  VpnKey as KeyIcon,
  MenuBook as BookIcon,
  ChevronRight as ChevronRightIcon,
  ArrowForward as ArrowRightIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  overflow: "hidden",
  height: "calc(100vh - 128px)", // Adjusted for header and footer
  display: "flex",
  flexDirection: "column",
}));

const StepContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  flex: 1,
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const InstructionCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  borderLeft: `4px solid ${theme.palette[color].main}`,
  backgroundColor: theme.palette[color].light,
  marginBottom: theme.spacing(2),
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ExamCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(3),
  borderLeft: `4px solid ${
    selected ? theme.palette.primary.main : theme.palette.divider
  }`,
  backgroundColor: selected
    ? theme.palette.primary.light
    : theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

const FixedHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "300px",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "white",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const ExamDetailsPage = () => {
  const theme = useTheme();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [studentDetails, setStudentDetails] = useState({
    studentName: "",
    itNumber: "",
    examPassword: "",
  });
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedRules, setAcceptedRules] = useState(false);

  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/exams/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  React.useEffect(() => {
    fetchExams();
  }, []);

  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails({ ...studentDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) {
      setError("Please select an exam");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/exams/exams/verify-password",
        {
          examId: selectedExam,
          password: studentDetails.examPassword,
        }
      );

      if (response.data.message === "Password verified") {
        setCurrentStep(2);
      }
    } catch (error) {
      setError("Invalid exam password or exam not found");
      console.error("Error verifying password:", error);
    }
  };

  const handleStartExam = () => {
    if (acceptedRules) {
      navigate(`/student-exam/${selectedExam}`, {
        state: {
          studentName: studentDetails.studentName,
          itNumber: studentDetails.itNumber,
        },
      });
    }
  };

  const selectedExamData = exams.find((exam) => exam._id === selectedExam);
  const steps = ["Login", "Instructions", "Rules"];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminHeader />
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar with branding */}
        <Sidebar>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center" }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                ExamSync
              </Typography>
              <Typography
                variant="h5"
                sx={{ opacity: 0.9, mb: 4, fontWeight: 500 }}
              >
                Online Examination Platform
              </Typography>
            </Box>

            <Box sx={{ textAlign: "left", width: "100%" }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Key Features:
              </Typography>
              <List dense sx={{ color: "rgba(255,255,255,0.9)" }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Secure exam environment" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Real-time monitoring" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Automatic grading" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "white" }}>
                    <CheckCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Detailed analytics" />
                </ListItem>
              </List>
            </Box>
          </motion.div>
        </Sidebar>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <StyledCard>
            {/* Fixed Header Section */}
            <FixedHeader>
              {/* Title */}
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.dark" }}
                >
                  {selectedExamData
                    ? `${selectedExamData.examName} - ${selectedExamData.moduleName}`
                    : "Exam Portal"}
                </Typography>
              </Box>

              {/* Stepper */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Stepper activeStep={currentStep - 1} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </FixedHeader>

            {/* Scrollable Content */}
            <Box sx={{ overflowY: "auto", height: "100%", pt: 2 }}>
              <AnimatePresence mode="wait">
                {/* Step 1: Login */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StepContainer>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.dark",
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LockIcon sx={{ mr: 1 }} /> Exam Login
                      </Typography>
                      <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                              Available Exams
                            </Typography>
                            {exams.length === 0 ? (
                              <Paper sx={{ p: 3, textAlign: "center" }}>
                                <Typography color="text.secondary">
                                  No exams available at this time
                                </Typography>
                              </Paper>
                            ) : (
                              <Box>
                                {exams.map((exam) => (
                                  <ExamCard
                                    key={exam._id}
                                    selected={selectedExam === exam._id}
                                    onClick={() => handleExamSelect(exam._id)}
                                  >
                                    <Grid container alignItems="center">
                                      <Grid item xs>
                                        <Typography
                                          variant="subtitle1"
                                          fontWeight="bold"
                                        >
                                          {exam.examName}
                                        </Typography>
                                        <Typography variant="body2">
                                          Module: {exam.moduleName}
                                        </Typography>
                                        <Typography variant="body2">
                                          Duration: {exam.duration} minutes
                                        </Typography>
                                      </Grid>
                                      <Grid item>
                                        <ChevronRightIcon
                                          color={
                                            selectedExam === exam._id
                                              ? "primary"
                                              : "action"
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </ExamCard>
                                ))}
                              </Box>
                            )}
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label={
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <UserIcon sx={{ mr: 1 }} /> Student Name
                                </Box>
                              }
                              name="studentName"
                              value={studentDetails.studentName}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label={
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <BookIcon sx={{ mr: 1 }} /> IT Number
                                </Box>
                              }
                              name="itNumber"
                              value={studentDetails.itNumber}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              type="password"
                              label={
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <KeyIcon sx={{ mr: 1 }} /> Exam Password
                                </Box>
                              }
                              name="examPassword"
                              value={studentDetails.examPassword}
                              onChange={handleInputChange}
                              required
                            />
                          </Grid>

                          {error && (
                            <Grid item xs={12}>
                              <Paper
                                elevation={0}
                                sx={{
                                  bgcolor: "error.light",
                                  borderLeft: "4px solid",
                                  borderColor: "error.main",
                                  p: 2,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <AlertTriangleIcon
                                  sx={{ color: "error.main", mr: 1 }}
                                />
                                <Typography color="error.main">
                                  {error}
                                </Typography>
                              </Paper>
                            </Grid>
                          )}

                          <Grid item xs={12} sx={{ pt: 2 }}>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              size="large"
                              endIcon={<ChevronRightIcon />}
                              disabled={!selectedExam}
                            >
                              Continue
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </StepContainer>
                  </motion.div>
                )}

                {/* Step 2: Instructions */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StepContainer>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.dark",
                          mb: 3,
                        }}
                      >
                        Online Exam Instructions
                      </Typography>

                      <Box sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: "semibold",
                            color: "primary.main",
                            mb: 2,
                          }}
                        >
                          Step-by-Step Exam Flow
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                              <InstructionCard color="info">
                                <Grid container spacing={2}>
                                  <Grid item xs="auto">
                                    <Box
                                      sx={{
                                        bgcolor: "info.lighter",
                                        p: 1,
                                        borderRadius: "50%",
                                        display: "inline-flex",
                                      }}
                                    >
                                      <UserIcon color="info" />
                                    </Box>
                                  </Grid>
                                  <Grid item xs>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "info.dark",
                                        mb: 1,
                                      }}
                                    >
                                      Login to Exam Portal
                                    </Typography>
                                    <List dense disablePadding>
                                      <ListItem disableGutters>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                          <CheckCircleIcon
                                            fontSize="small"
                                            color="info"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Use your student credentials (Username & Password) to securely log in."
                                          sx={{ m: 0 }}
                                        />
                                      </ListItem>
                                      <ListItem disableGutters>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                          <CheckCircleIcon
                                            fontSize="small"
                                            color="info"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Ensure you have a stable internet connection and your device is charged."
                                          sx={{ m: 0 }}
                                        />
                                      </ListItem>
                                    </List>
                                  </Grid>
                                </Grid>
                              </InstructionCard>
                            </motion.div>
                          </Grid>

                          <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                              <InstructionCard color="secondary">
                                <Grid container spacing={2}>
                                  <Grid item xs="auto">
                                    <Box
                                      sx={{
                                        bgcolor: "secondary.lighter",
                                        p: 1,
                                        borderRadius: "50%",
                                        display: "inline-flex",
                                      }}
                                    >
                                      <AlertTriangleIcon color="secondary" />
                                    </Box>
                                  </Grid>
                                  <Grid item xs>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "secondary.dark",
                                        mb: 1,
                                      }}
                                    >
                                      Read the Exam Rules Carefully
                                    </Typography>
                                    <Typography variant="body2">
                                      Before starting the exam, read and agree
                                      to all exam rules listed below.
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </InstructionCard>
                            </motion.div>
                          </Grid>

                          <Grid item xs={12}>
                            <motion.div whileHover={{ scale: 1.02 }}>
                              <InstructionCard color="success">
                                <Grid container spacing={2}>
                                  <Grid item xs="auto">
                                    <Box
                                      sx={{
                                        bgcolor: "success.lighter",
                                        p: 1,
                                        borderRadius: "50%",
                                        display: "inline-flex",
                                      }}
                                    >
                                      <ClockIcon color="success" />
                                    </Box>
                                  </Grid>
                                  <Grid item xs>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "success.dark",
                                        mb: 1,
                                      }}
                                    >
                                      Start the Exam
                                    </Typography>
                                    <List dense disablePadding>
                                      <ListItem disableGutters>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                          <CheckCircleIcon
                                            fontSize="small"
                                            color="success"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary='Click on the "Start Exam" button after reviewing the rules.'
                                          sx={{ m: 0 }}
                                        />
                                      </ListItem>
                                      <ListItem disableGutters>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                          <CheckCircleIcon
                                            fontSize="small"
                                            color="success"
                                          />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="The timer will start immediately once the exam begins."
                                          sx={{ m: 0 }}
                                        />
                                      </ListItem>
                                    </List>
                                  </Grid>
                                </Grid>
                              </InstructionCard>
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          onClick={() => setCurrentStep(3)}
                          variant="contained"
                          endIcon={<ChevronRightIcon />}
                        >
                          Next: Exam Rules
                        </Button>
                      </Box>
                    </StepContainer>
                  </motion.div>
                )}

                {/* Step 3: Rules */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StepContainer>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.dark",
                          mb: 3,
                        }}
                      >
                        Exam Rules
                      </Typography>

                      <Box
                        sx={{
                          mb: 4,
                          bgcolor: "error.lighter",
                          borderLeft: "4px solid",
                          borderColor: "error.main",
                          p: 3,
                          borderRadius: 1,
                        }}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs="auto">
                            <AlertTriangleIcon color="error" />
                          </Grid>
                          <Grid item xs>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                                color: "error.dark",
                                mb: 1,
                              }}
                            >
                              Important: Please read all rules carefully
                            </Typography>
                            <Typography color="error.main">
                              Violation of any rule may result in exam
                              disqualification.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <List sx={{ mb: 4 }}>
                        {[
                          "Do not refresh or close the browser tab during the exam.",
                          "Each student is allowed to take the exam only once.",
                          "You must complete the exam within the allocated time.",
                          "Use of external help, devices, or switching tabs may lead to disqualification.",
                          "The exam may include randomized questions and options to ensure fairness.",
                          "If your session is interrupted, re-login within the time limit to continue.",
                          "Do not copy, share, or distribute exam content.",
                          "Structured answers should be written in your own words. Plagiarism is strictly prohibited.",
                        ].map((rule, index) => (
                          <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={rule} />
                          </ListItem>
                        ))}
                      </List>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={acceptedRules}
                            onChange={(e) => setAcceptedRules(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="I have read and agree to all the exam rules above"
                        sx={{ mb: 4 }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          onClick={() => setCurrentStep(2)}
                          variant="outlined"
                          size="large"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleStartExam}
                          disabled={!acceptedRules}
                          variant="contained"
                          size="large"
                          endIcon={<ArrowRightIcon />}
                        >
                          Start Exam
                        </Button>
                      </Box>
                    </StepContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </StyledCard>
        </Box>
      </Box>
      <AdminFooter />
    </Box>
  );
};

export default ExamDetailsPage;
