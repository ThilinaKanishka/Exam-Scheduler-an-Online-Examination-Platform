import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/Registration";
import Logging from "./components/Logging";
import Home from "./components/Home";
import Adminpanel from "./components/Adminpanel";
import AdminScheduleExa from "./components/AdminShedualExam";
import ResultsPage from "./components/ResultsPage";
import ExamDetailsPage from "./components/ExamDetailsPage";
import StudentExamPage from "./components/StudentExamPage";
import AllExam from "./components/AllExam";
import ScheduleTimetable from "./components/ScheduleTimetable";
import AllTimetable from "./components/AllTimetable";
import StudentTimetable from "./components/StudentTimetable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />} />
        <Route path="/" element={<Logging />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Adminpanel" element={<Adminpanel />} />
        <Route path="/AdminScheduleExa" element={<AdminScheduleExa />} />
        <Route path="/ResultsPage" element={<ResultsPage />} />
        <Route path="/ExamDetailsPage" element={<ExamDetailsPage />} />
        <Route path="/student-exam/:examId" element={<StudentExamPage />} />
        <Route path="/AllExam" element={<AllExam />} />
        <Route path="/ScheduleTimetable" element={<ScheduleTimetable />} />
        <Route path="/AllTimetable" element={<AllTimetable />} />
        <Route path="/StudentTimetable" element={<StudentTimetable />} />
        {/* Add student and admin dashboards here */}
      </Routes>
    </Router>
  );
}

export default App;
