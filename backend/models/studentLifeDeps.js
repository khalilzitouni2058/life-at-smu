const mongoose = require('mongoose');

const studentLifeDepsepSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student Life Member', 'Officer'],
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const studentLifeDeps = mongoose.model('studentLifeDeps', studentLifeDepsepSchema);
module.exports = studentLifeDeps;
