import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ModalExample from "./Modal"; // Import the Modal component
import Axios from "axios";
import config from "../config.json";  

const DropDownItems = ({ filters, setFilters, refreshData }) => {
  const [names, setNames] = useState([]); // State for student names
  const [classes, setClasses] = useState([]); // State for classes
  const [error, setError] = useState(""); // State for errors

  // Fetch distinct student names and classes
  const fetchDistinctValues = async () => {
    try {
      // Fetch distinct student names
      const namesResponse = await Axios.get(`${config.backendUrl}/getDistinctNames`);
      setNames(namesResponse.data);
      filters.name = namesResponse.data[0]; // Set default name

      // Fetch distinct classes
      const classesResponse = await Axios.get(`${config.backendUrl}/getDistinctClasses`);
      setClasses(classesResponse.data);
      filters.class = classesResponse.data[0]; // Set default name
      refreshData();
    } catch (err) {
      console.error("Error fetching distinct values:", err.response?.data || err.message);
      setError("Failed to fetch dropdown values.");
    }
  };

  // Fetch dropdown values when the component mounts
  useEffect(() => {
    fetchDistinctValues();
  }, []);

  // Reset filters to default values
  const handleReset = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    setFilters({
      name: "",
      class: "",
      startDate: new Date(currentYear, currentMonth, 1),
      endDate: new Date(currentYear, currentMonth + 1, 0),
    });
  };

  // Handle "Add Students" button click
  const handleAddStudents = () => {
    refreshData(); // Refresh dropdown and main API data
    fetchDistinctValues(); // Refresh dropdown values
  };

  return (
    <div className="filters d-flex flex-column align-items-center mt-3">
      <div className="d-flex justify-content-center align-items-center">
        {/* Student Names Dropdown */}
        <label className="me-2">Student Names:</label>
        <select
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        >
          {/* <option value="">All</option> */}
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* Class Dropdown */}
        <label className="ms-3 me-2">Class:</label>
        <select
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
        >
          {/* <option value="">All</option> */}
          {classes.map((classItem) => (
            <option key={classItem} value={classItem}>
              {classItem}
            </option>
          ))}
        </select>

        {/* Start Date Picker */}
        <label className="ms-3 me-2">Start Date:</label>
        <DatePicker
          selected={filters.startDate}
          onChange={(date) => setFilters({ ...filters, startDate: date })}
          dateFormat="yyyy-MM-dd"
        />

        {/* End Date Picker */}
        <label className="ms-3 me-2">End Date:</label>
        <DatePicker
          selected={filters.endDate}
          onChange={(date) => setFilters({ ...filters, endDate: date })}
          dateFormat="yyyy-MM-dd"
        />

        {/* Reset and Modal Buttons */}
        <button
          className="btn btn-primary mx-3"
          onClick={handleAddStudents}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Students
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Error Handling */}
      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Include the Modal */}
      <ModalExample />
    </div>
  );
};

export default DropDownItems;
