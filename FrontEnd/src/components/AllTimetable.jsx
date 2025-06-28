import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiEdit,
  FiTrash2,
  FiDownload,
  FiSave,
  FiX,
  FiPlus,
  FiCalendar,
  FiBook,
  FiUser,
  FiHome,
  FiClock,
  FiChevronDown,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import AdminHeader from "./AdminPanelHeader";
import AdminFooter from "./AdminPanelFooter";

const AllTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTimetable, setEditedTimetable] = useState(null);
  const [newModule, setNewModule] = useState({
    moduleName: "",
    moduleCode: "",
    instructor: "",
    venue: "",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    examType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    timetableType: "",
    faculty: "",
    semester: "",
    weekType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/timetables"
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
  }, []);

  useEffect(() => {
    filterTimetables();
  }, [searchTerm, filters, timetables]);

  const filterTimetables = () => {
    let results = [...timetables];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter((timetable) => {
        return (
          timetable.faculty?.toLowerCase().includes(term) ||
          timetable.timetableType?.toLowerCase().includes(term) ||
          timetable.semester?.toLowerCase().includes(term) ||
          timetable.weekType?.toLowerCase().includes(term) ||
          timetable.modules.some(
            (module) =>
              module.moduleName?.toLowerCase().includes(term) ||
              module.moduleCode?.toLowerCase().includes(term) ||
              module.instructor?.toLowerCase().includes(term) ||
              module.venue?.toLowerCase().includes(term)
          )
        );
      });
    }

    // Apply other filters
    if (filters.timetableType) {
      results = results.filter(
        (t) => t.timetableType === filters.timetableType
      );
    }
    if (filters.faculty) {
      results = results.filter((t) => t.faculty === filters.faculty);
    }
    if (filters.semester) {
      results = results.filter((t) => t.semester === filters.semester);
    }
    if (filters.weekType) {
      results = results.filter((t) => t.weekType === filters.weekType);
    }

    setFilteredTimetables(results);
  };

  const handleEdit = (timetable) => {
    setEditingId(timetable._id);
    setEditedTimetable({
      ...timetable,
      modules: timetable.modules.map((module) => ({ ...module })),
    });
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = editedTimetable.modules.map((module, i) =>
      i === index ? { ...module, [field]: value } : module
    );
    setEditedTimetable({ ...editedTimetable, modules: updatedModules });
  };

  const addNewModule = () => {
    if (
      !newModule.moduleName ||
      !newModule.moduleCode ||
      !newModule.instructor ||
      !newModule.venue
    ) {
      setError("Please fill all required module fields");
      return;
    }

    const moduleToAdd = {
      moduleName: newModule.moduleName,
      moduleCode: newModule.moduleCode,
      instructor: newModule.instructor,
      venue: newModule.venue,
      day: newModule.day,
      startTime: newModule.startTime,
      endTime: newModule.endTime,
    };

    if (
      editedTimetable.timetableType !== "All Semester" &&
      newModule.examType
    ) {
      moduleToAdd.examType = newModule.examType;
    }

    setEditedTimetable({
      ...editedTimetable,
      modules: [...editedTimetable.modules, moduleToAdd],
    });

    setNewModule({
      moduleName: "",
      moduleCode: "",
      instructor: "",
      venue: "",
      day: "Monday",
      startTime: "08:00",
      endTime: "09:00",
      examType: "",
    });
    setError("");
  };

  const removeModule = (index) => {
    const updatedModules = editedTimetable.modules.filter(
      (_, i) => i !== index
    );
    setEditedTimetable({ ...editedTimetable, modules: updatedModules });
  };

  const saveChanges = async () => {
    try {
      if (editedTimetable.timetableType !== "All Semester") {
        const modulesWithoutExamType = editedTimetable.modules.filter(
          (module) => !module.examType
        );
        if (modulesWithoutExamType.length > 0) {
          throw new Error(
            "All modules must have an exam type for exam timetables"
          );
        }
      }

      const response = await axios.put(
        `http://localhost:5000/api/timetables/${editingId}`,
        { modules: editedTimetable.modules }
      );

      setTimetables(
        timetables.map((t) =>
          t._id === editingId ? { ...t, modules: response.data.modules } : t
        )
      );

      setEditingId(null);
      setEditedTimetable(null);
      setSuccess("Timetable updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to update timetable"
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/timetables/${id}`);
      setTimetables(timetables.filter((t) => t._id !== id));
      setSuccess("Timetable deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete timetable");
      setTimeout(() => setError(""), 3000);
    }
  };

  const generatePDF = (timetable) => {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ExamSync Campus", doc.internal.pageSize.getWidth() / 2, 17, {
        align: "center",
      });

      let title = `${timetable.timetableType.toUpperCase()} TIMETABLE`;
      if (timetable.semester) title += ` - ${timetable.semester}`;

      doc.setTextColor(30, 58, 138);
      doc.setFontSize(16);
      doc.text(title, doc.internal.pageSize.getWidth() / 2, 35, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(`Faculty: ${timetable.faculty || "N/A"}`, 15, 45);
      if (timetable.semester)
        doc.text(`Semester: ${timetable.semester}`, 15, 52);
      if (timetable.weekType)
        doc.text(`Week Type: ${timetable.weekType}`, 15, 59);

      doc.text(
        `Academic Year: ${new Date().getFullYear()}/${
          new Date().getFullYear() + 1
        }`,
        doc.internal.pageSize.getWidth() - 15,
        45,
        { align: "right" }
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.getWidth() - 15,
        52,
        { align: "right" }
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 70, doc.internal.pageSize.getWidth() - 15, 70);

      const headers = [
        [
          "Day",
          "Module Code",
          "Module Name",
          "Start Time",
          "End Time",
          "Venue",
          "Instructor",
          ...(timetable.timetableType !== "All Semester" ? ["Exam Type"] : []),
        ],
      ];

      const data = timetable.modules.map((module) => [
        module.day,
        module.moduleCode,
        module.moduleName,
        module.startTime,
        module.endTime,
        module.venue,
        module.instructor,
        ...(timetable.timetableType !== "All Semester"
          ? [module.examType || "N/A"]
          : []),
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 75,
        margin: { left: 5, right: 5 },
        tableWidth: "auto",
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          cellPadding: 4,
        },
        bodyStyles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" },
          1: { cellWidth: 25, halign: "center" },
          2: { cellWidth: "auto" },
          3: { cellWidth: 20, halign: "center" },
          4: { cellWidth: 20, halign: "center" },
          5: { cellWidth: 25, halign: "center" },
          6: { cellWidth: "auto" },
          ...(timetable.timetableType !== "All Semester"
            ? { 7: { cellWidth: 30, halign: "center" } }
            : {}),
        },
        didDrawPage: (data) => {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
          );
        },
      });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `ExamSync_${timetable.timetableType.replace(
        /\s+/g,
        "_"
      )}_${timetable.faculty}_${timetable.semester || ""}_${timestamp}.pdf`;
      doc.save(filename);
    } catch (err) {
      setError("Failed to generate PDF: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetFilters = () => {
    setFilters({
      timetableType: "",
      faculty: "",
      semester: "",
      weekType: "",
    });
    setSearchTerm("");
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(timetables.map((t) => t[key]).filter(Boolean))];
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <FiCalendar className="mr-3" />
              All Generated Timetables
            </h2>
          </div>

          <div className="p-6">
            {/* Search and Filter Section */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search timetables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiFilter className="mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timetable Type
                      </label>
                      <select
                        value={filters.timetableType}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            timetableType: e.target.value,
                          })
                        }
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          All Types
                        </option>
                        {getUniqueValues("timetableType").map((type) => (
                          <option
                            key={type}
                            value={type}
                            className="text-gray-900"
                          >
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty
                      </label>
                      <select
                        value={filters.faculty}
                        onChange={(e) =>
                          setFilters({ ...filters, faculty: e.target.value })
                        }
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          All Faculties
                        </option>
                        {getUniqueValues("faculty").map((faculty) => (
                          <option
                            key={faculty}
                            value={faculty}
                            className="text-gray-900"
                          >
                            {faculty}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Semester
                      </label>
                      <select
                        value={filters.semester}
                        onChange={(e) =>
                          setFilters({ ...filters, semester: e.target.value })
                        }
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          All Semesters
                        </option>
                        {getUniqueValues("semester").map((semester) => (
                          <option
                            key={semester}
                            value={semester}
                            className="text-gray-900"
                          >
                            {semester}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Week Type
                      </label>
                      <select
                        value={filters.weekType}
                        onChange={(e) =>
                          setFilters({ ...filters, weekType: e.target.value })
                        }
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          All Week Types
                        </option>
                        {getUniqueValues("weekType").map((weekType) => (
                          <option
                            key={weekType}
                            value={weekType}
                            className="text-gray-900"
                          >
                            {weekType}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

            {filteredTimetables.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                {timetables.length === 0
                  ? "No timetables found. Create one to get started."
                  : "No timetables match your search criteria."}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredTimetables.map((timetable) => (
                  <div
                    key={timetable._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-indigo-100 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-indigo-800">
                        {timetable.timetableType} - {timetable.faculty}
                        {timetable.semester && ` - ${timetable.semester}`}
                        {timetable.weekType && ` - ${timetable.weekType}`}
                      </h3>

                      {editingId !== timetable._id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => generatePDF(timetable)}
                            className="flex items-center px-3 py-1 bg-white text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-50 transition duration-200"
                          >
                            <FiDownload className="mr-1" /> PDF
                          </button>
                          <button
                            onClick={() => handleEdit(timetable)}
                            className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(timetable._id)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === timetable._id ? (
                      <div className="p-6">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Day
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Module Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Module Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Venue
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Start Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  End Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Instructor
                                </th>
                                {timetable.timetableType !== "All Semester" && (
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Exam Type
                                  </th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {editedTimetable?.modules?.map((module, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <select
                                      value={module.day}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "day",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full pl-3 pr-10 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    >
                                      {[
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                        "Sunday",
                                      ].map((day) => (
                                        <option
                                          key={day}
                                          value={day}
                                          className="text-gray-900"
                                        >
                                          {day}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={module.moduleName}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "moduleName",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={module.moduleCode}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "moduleCode",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={module.venue}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "venue",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="time"
                                      value={module.startTime}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "startTime",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="time"
                                      value={module.endTime}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "endTime",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={module.instructor}
                                      onChange={(e) =>
                                        handleModuleChange(
                                          idx,
                                          "instructor",
                                          e.target.value
                                        )
                                      }
                                      className="block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                  </td>
                                  {timetable.timetableType !==
                                    "All Semester" && (
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <select
                                        value={module.examType || ""}
                                        onChange={(e) =>
                                          handleModuleChange(
                                            idx,
                                            "examType",
                                            e.target.value
                                          )
                                        }
                                        className="block w-full pl-3 pr-10 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                      >
                                        <option
                                          value=""
                                          className="text-gray-900"
                                        >
                                          Select Type
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
                                    </td>
                                  )}
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <button
                                      onClick={() => removeModule(idx)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <FiPlus className="mr-2 text-indigo-600" />
                            Add New Module
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Module Name
                              </label>
                              <input
                                type="text"
                                value={newModule.moduleName}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    moduleName: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Module Code
                              </label>
                              <input
                                type="text"
                                value={newModule.moduleCode}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    moduleCode: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instructor
                              </label>
                              <input
                                type="text"
                                value={newModule.instructor}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    instructor: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Venue
                              </label>
                              <input
                                type="text"
                                value={newModule.venue}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    venue: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                            {timetable.timetableType !== "All Semester" && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Exam Type
                                </label>
                                <select
                                  value={newModule.examType}
                                  onChange={(e) =>
                                    setNewModule({
                                      ...newModule,
                                      examType: e.target.value,
                                    })
                                  }
                                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                >
                                  <option value="" className="text-gray-900">
                                    Select Type
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
                              </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Day
                              </label>
                              <select
                                value={newModule.day}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    day: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              >
                                {[
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                  "Sunday",
                                ].map((day) => (
                                  <option
                                    key={day}
                                    value={day}
                                    className="text-gray-900"
                                  >
                                    {day}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={newModule.startTime}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    startTime: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={newModule.endTime}
                                onChange={(e) =>
                                  setNewModule({
                                    ...newModule,
                                    endTime: e.target.value,
                                  })
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              onClick={addNewModule}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiPlus className="mr-2" />
                              Add Module
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FiX className="mr-2" />
                            Cancel
                          </button>
                          <button
                            onClick={saveChanges}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FiSave className="mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Day
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Module Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Module Code
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Venue
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Start Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  End Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Instructor
                                </th>
                                {timetable.timetableType !== "All Semester" && (
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Exam Type
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {timetable.modules.map((module, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.day}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.moduleName}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.moduleCode}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.venue}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.startTime}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.endTime}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {module.instructor}
                                  </td>
                                  {timetable.timetableType !==
                                    "All Semester" && (
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {module.examType || "N/A"}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminFooter />

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

export default AllTimetable;
