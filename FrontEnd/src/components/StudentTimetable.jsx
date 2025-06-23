import { useState, useEffect } from "react";
import axios from "axios";

const StudentTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [faculty, setFaculty] = useState("computing");
  const [timetableType, setTimetableType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/timetables/faculty/${faculty}/${timetableType}`
        );
        setTimetables(response.data);
        setFilteredTimetables(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch timetables");
        setLoading(false);
      }
    };

    fetchTimetables();
  }, [faculty, timetableType]);

  const downloadAsPDF = (timetable) => {
    // This is a placeholder - in a real app you would generate a PDF
    console.log("Downloading timetable as PDF:", timetable);
    alert(
      `PDF download for ${timetable.timetableType} timetable would be implemented here`
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Student Timetable View</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Faculty: </label>
        <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
          <option value="computing">Computing</option>
          <option value="engineering">Engineering</option>
          <option value="business">Business</option>
          <option value="nursing">Nursing</option>
        </select>

        <label style={{ marginLeft: "10px" }}>Timetable Type: </label>
        <select
          value={timetableType}
          onChange={(e) => setTimetableType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="All Semester">All Semester</option>
          <option value="MID Exam">MID Exam</option>
          <option value="Final Exam">Final Exam</option>
          <option value="Peapeat-MID">Peapeat-MID</option>
          <option value="Peapeat-Final">Peapeat-Final</option>
        </select>
      </div>

      {filteredTimetables.length === 0 ? (
        <div>No timetables found for the selected criteria</div>
      ) : (
        <div>
          {filteredTimetables.map((timetable) => (
            <div
              key={timetable._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>
                {timetable.timetableType} - {timetable.faculty}
                {timetable.semester && ` - ${timetable.semester}`}
                {timetable.weekType && ` - ${timetable.weekType}`}
              </h3>

              <table border="1" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Module Name</th>
                    <th>Module Code</th>
                    <th>Instructor</th>
                    <th>Venue</th>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.modules.map((module, idx) => (
                    <tr key={idx}>
                      <td>{module.moduleName}</td>
                      <td>{module.moduleCode}</td>
                      <td>{module.instructor}</td>
                      <td>{module.venue}</td>
                      <td>{module.day}</td>
                      <td>{module.startTime}</td>
                      <td>{module.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={() => downloadAsPDF(timetable)}
                style={{ marginTop: "10px" }}
              >
                Download as PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
