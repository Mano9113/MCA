const mongoose = require('mongoose');

// Schema for Employees collection
const EmployeeSchema = new mongoose.Schema({
  Day: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  A: {
    type: Number,
    required: true,
  },
  B: {
    type: Number,
    required: true,
  },
  C: {
    type: Number,
    required: true,
  },
  D: {
    type: Number,
    required: true,
  },
  E: {
    type: Number,
    required: true,
  },
  F: {
    type: Number,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model('Employee', EmployeeSchema);
