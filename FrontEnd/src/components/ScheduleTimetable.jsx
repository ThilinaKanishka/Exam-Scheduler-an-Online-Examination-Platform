import { useState } from "react";
import axios from "axios";

const ScheduleTimetable = () => {
  const [formData, setFormData] = useState({
    timetableType: "All Semester",
    faculty: "computing",
    semester: "Y1S1", // Default semester
    weekType: "WD",
    modules: [
      {
        moduleName: "",
        moduleCode: "",
        instructor: "",
        venue: "",
        examType: "",
      },
    ],
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
        {
          moduleName: "",
          moduleCode: "",
          instructor: "",
          venue: "",
          examType: "",
        },
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
      // Validate exam types for exam timetables
      if (formData.timetableType !== "All Semester") {
        const modulesWithoutExamType = formData.modules.filter(
          (module) => !module.examType
        );
        if (modulesWithoutExamType.length > 0) {
          throw new Error(
            "Exam type is required for all modules in exam timetables"
          );
        }
      }

      const submissionData = {
        timetableType: formData.timetableType,
        faculty: formData.faculty,
        semester: formData.semester, // Always include semester
        weekType:
          formData.timetableType === "All Semester"
            ? formData.weekType
            : undefined,
        modules: formData.modules.map((module) => ({
          moduleName: module.moduleName,
          moduleCode: module.moduleCode,
          instructor: module.instructor,
          venue: module.venue,
          ...(formData.timetableType !== "All Semester" && {
            examType: module.examType,
          }),
        })),
      };

      const response = await axios.post(
        "http://localhost:5000/api/timetables/generate",
        submissionData
      );
      setSuccess("Timetable generated successfully!");
      setFormData({
        timetableType: "All Semester",
        faculty: "computing",
        semester: "Y1S1",
        weekType: "WD",
        modules: [
          {
            moduleName: "",
            moduleCode: "",
            instructor: "",
            venue: "",
            examType: "",
          },
        ],
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate timetable"
      );
    }
  };

  return (
    <div className="schedule-timetable-container">
      <h2>Generate New Timetable</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="timetable-form">
        <div className="form-group">
          <label>Timetable Type:</label>
          <select
            name="timetableType"
            value={formData.timetableType}
            onChange={handleChange}
            required
          >
            <option value="All Semester">All Semester</option>
            <option value="MID Exam">MID Exam</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Peapeat-MID">Peapeat-MID</option>
            <option value="Peapeat-Final">Peapeat-Final</option>
          </select>
        </div>

        <div className="form-group">
          <label>Faculty:</label>
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
          >
            <option value="computing">Computing</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
            <option value="nursing">Nursing</option>
          </select>
        </div>

        {/* Always show Semester selection */}
        <div className="form-group">
          <label>Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
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

        {/* Only show Week Type for All Semester */}
        {formData.timetableType === "All Semester" && (
          <div className="form-group">
            <label>Week Type:</label>
            <select
              name="weekType"
              value={formData.weekType}
              onChange={handleChange}
              required
            >
              <option value="WD">Weekday (WD)</option>
              <option value="WE">Weekend (WE)</option>
            </select>
          </div>
        )}

        <h3>Modules (Minimum 4 required)</h3>
        {formData.modules.map((module, index) => (
          <div key={index} className="module-card">
            <div className="form-group">
              <label>Module Name:</label>
              <input
                type="text"
                name="moduleName"
                value={module.moduleName}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div className="form-group">
              <label>Module Code:</label>
              <input
                type="text"
                name="moduleCode"
                value={module.moduleCode}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div className="form-group">
              <label>Instructor:</label>
              <input
                type="text"
                name="instructor"
                value={module.instructor}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            <div className="form-group">
              <label>Venue:</label>
              <input
                type="text"
                name="venue"
                value={module.venue}
                onChange={(e) => handleModuleChange(index, e)}
                required
              />
            </div>
            {formData.timetableType !== "All Semester" && (
              <div className="form-group">
                <label>Exam Type:</label>
                <select
                  name="examType"
                  value={module.examType}
                  onChange={(e) => handleModuleChange(index, e)}
                  required={formData.timetableType !== "All Semester"}
                >
                  <option value="">Select Exam Type</option>
                  <option value="physics">Physical</option>
                  <option value="computer base">Computer Base</option>
                </select>
              </div>
            )}
            {formData.modules.length > 1 && (
              <button
                type="button"
                onClick={() => removeModule(index)}
                className="remove-btn"
              >
                Remove Module
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addModule} className="add-btn">
          Add Module
        </button>

        <button
          type="submit"
          disabled={formData.modules.length < 4}
          className="submit-btn"
        >
          Generate Timetable
        </button>
      </form>
    </div>
  );
};

export default ScheduleTimetable;
