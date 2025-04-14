const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  fullname: {
    type: String,
    required: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String, 
  },
  program: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  clubs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
  }],
  clubRequests: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" }
  }],
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
