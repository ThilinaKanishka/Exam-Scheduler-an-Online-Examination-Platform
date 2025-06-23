import { useState } from "react";
import axios from "axios";

const ScheduleTimetable = () => {
  const [formData, setFormData] = useState({
    timetableType: "All Semester",
    faculty: "computing",
    semester: "Y1S1",
    weekType: "WD",
    examType: "",
    modules: [{ moduleName: "", moduleCode: "", instructor: "", venue: "" }],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedModules = [...formData.modules];
    updatedModules[index][name] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { moduleName: "", moduleCode: "", instructor: "", venue: "" },
      ],
    });
  };

  const removeModule = (index) => {
    const updatedModules = [...formData.modules];
    updatedModules.splice(index, 1);
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/timetables/generate",
        formData
      );
      setSuccess("Timetable generated successfully!");
      setFormData({
        timetableType: "All Semester",
        faculty: "computing",
        semester: "Y1S1",
        weekType: "WD",
        examType: "",
        modules: [
          { moduleName: "", moduleCode: "", instructor: "", venue: "" },
        ],
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate timetable");
    }
  };

  return (
    <div>
      <h2>Generate New Timetable</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Timetable Type:</label>
          <select
            name="timetableType"
            value={formData.timetableType}
            onChange={handleChange}
          >
            <option value="All Semester">All Semester</option>
            <option value="MID Exam">MID Exam</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Peapeat-MID">Peapeat-MID</option>
            <option value="Peapeat-Final">Peapeat-Final</option>
          </select>
        </div>

        <div>
          <label>Faculty:</label>
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
          >
            <option value="computing">Computing</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="nursing">Nursing</option>
          </select>
        </div>

        {formData.timetableType === "All Semester" && (
          <>
            <div>
              <label>Semester:</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                {[
                  "Y1S1",
                  "Y1S2",
                  "Y2S1",
                  "Y2S2",
                  "Y3S1",
                  "Y3S2",
                  "Y4S1",
                  "Y4S2",
                ].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Week Type:</label>
              <select
                name="weekType"
                value={formData.weekType}
                onChange={handleChange}
              >
                <option value="WD">Weekday (WD)</option>
                <option value="WE">Weekend (WE)</option>
              </select>
            </div>
          </>
        )}

        {formData.timetableType !== "All Semester" && (
          <div>
            <label>Exam Type:</label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
            >
              <option value="">Select Exam Type</option>
              <option value="physics">Physics</option>
              <option value="computer base">Computer Base</option>
            </select>
          </div>
        )}

        <h3>Modules (Minimum 4 required)</h3>
        {formData.modules.map((module, index) => (
          <div key={index}>
            <div>
              <label>Module Name:</label>
              <input
                type="text"
                name="moduleName"
                value={module.moduleName}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Module Code:</label>
              <input
                type="text"
                name="moduleCode"
                value={module.moduleCode}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Instructor:</label>
              <input
                type="text"
                name="instructor"
                value={module.instructor}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Venue:</label>
              <input
                type="text"
                name="venue"
                value={module.venue}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            {formData.modules.length > 1 && (
              <button type="button" onClick={() => removeModule(index)}>
                Remove Module
              </button>
            )}
            <hr />
          </div>
        ))}

        <button type="button" onClick={addModule}>
          Add Module
        </button>

        <button type="submit" disabled={formData.modules.length < 4}>
          Generate Timetable
        </button>
      </form>
    </div>
  );
};

export default ScheduleTimetable;
