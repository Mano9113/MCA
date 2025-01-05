const mongoose = require('mongoose'); // Import mongoose

const StudentMarksSchema = new mongoose.Schema({
  Name: { type: String, required: true }, // Allow duplicates
  Class: { type: String, sparse: true }, // Optional field
  Date: { type: Date, required: true }, // Allow duplicates
  KANNADA: { type: Number, required: true },
  ENGLISH: { type: Number, required: true },
  PHYSICS: { type: Number, required: true },
  CHEMISTRY: { type: Number, required: true },
  MATHEMATICS: { type: Number, required: true },
  BIOLOGY: { type: Number, required: true },
});

module.exports = mongoose.model('studentmarks01', StudentMarksSchema);
