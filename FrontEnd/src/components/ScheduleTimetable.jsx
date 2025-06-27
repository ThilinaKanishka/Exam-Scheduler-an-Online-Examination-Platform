import { useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiCalendar,
  FiBook,
  FiUser,
  FiHome,
  FiClock,
  FiChevronDown,
} from "react-icons/fi";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";

const ScheduleTimetable = () => {
  const [formData, setFormData] = useState({
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
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
        semester: formData.semester,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <FiCalendar className="mr-3" />
              Generate New Timetable
            </h2>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded animate-shake">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded animate-fade-in">
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timetable Type
                  </label>
                  <div className="relative">
                    <select
                      name="timetableType"
                      value={formData.timetableType}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                    >
                      <option value="All Semester" className="text-gray-900">
                        All Semester
                      </option>
                      <option value="MID Exam" className="text-gray-900">
                        MID Exam
                      </option>
                      <option value="Final Exam" className="text-gray-900">
                        Final Exam
                      </option>
                      <option value="Peapeat-MID" className="text-gray-900">
                        Peapeat-MID
                      </option>
                      <option value="Peapeat-Final" className="text-gray-900">
                        Peapeat-Final
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty
                  </label>
                  <div className="relative">
                    <select
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                    >
                      <option value="computing" className="text-gray-900">
                        Computing
                      </option>
                      <option value="engineering" className="text-gray-900">
                        Engineering
                      </option>
                      <option value="business" className="text-gray-900">
                        Business
                      </option>
                      <option value="nursing" className="text-gray-900">
                        Nursing
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <div className="relative">
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
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
                        <option key={sem} value={sem} className="text-gray-900">
                          {sem}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>

                {formData.timetableType === "All Semester" && (
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Week Type
                    </label>
                    <div className="relative">
                      <select
                        name="weekType"
                        value={formData.weekType}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                      >
                        <option value="WD" className="text-gray-900">
                          Weekday (WD)
                        </option>
                        <option value="WE" className="text-gray-900">
                          Weekend (WE)
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <FiChevronDown className="text-gray-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiBook className="mr-2 text-indigo-600" />
                  Modules (Minimum 4 required)
                </h3>

                <div className="space-y-4">
                  {formData.modules.map((module, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-indigo-300 transition duration-200 animate-fade-in-up"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiBook className="mr-1 text-indigo-500" />
                            Module Name
                          </label>
                          <input
                            type="text"
                            name="moduleName"
                            value={module.moduleName}
                            onChange={(e) => handleModuleChange(index, e)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiBook className="mr-1 text-indigo-500" />
                            Module Code
                          </label>
                          <input
                            type="text"
                            name="moduleCode"
                            value={module.moduleCode}
                            onChange={(e) => handleModuleChange(index, e)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiUser className="mr-1 text-indigo-500" />
                            Instructor
                          </label>
                          <input
                            type="text"
                            name="instructor"
                            value={module.instructor}
                            onChange={(e) => handleModuleChange(index, e)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiHome className="mr-1 text-indigo-500" />
                            Venue
                          </label>
                          <input
                            type="text"
                            name="venue"
                            value={module.venue}
                            onChange={(e) => handleModuleChange(index, e)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                          />
                        </div>

                        {formData.timetableType !== "All Semester" && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                              <FiClock className="mr-1 text-indigo-500" />
                              Exam Type
                            </label>
                            <div className="relative">
                              <select
                                name="examType"
                                value={module.examType}
                                onChange={(e) => handleModuleChange(index, e)}
                                required={
                                  formData.timetableType !== "All Semester"
                                }
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition duration-200"
                              >
                                <option value="" className="text-gray-500">
                                  Select Exam Type
                                </option>
                                <option
                                  value="physics"
                                  className="text-gray-900"
                                >
                                  Physical
                                </option>
                                <option
                                  value="computer base"
                                  className="text-gray-900"
                                >
                                  Computer Base
                                </option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <FiChevronDown className="text-gray-500" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {formData.modules.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                          >
                            <FiTrash2 className="mr-1" />
                            Remove Module
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={addModule}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 hover:scale-105 transform"
                  >
                    <FiPlus className="mr-2" />
                    Add Module
                  </button>
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={formData.modules.length < 4 || isSubmitting}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 transform hover:scale-105 ${
                    formData.modules.length < 4 || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:ring-indigo-500"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Generate Timetable
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AdminFooter />

      {/* Add custom animations to Tailwind config */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ScheduleTimetable;
