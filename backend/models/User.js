const mongoose = require('mongoose');

// Schema for Users collection
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('user', UserSchema);