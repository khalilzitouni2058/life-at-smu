const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const boardMemberSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
  },
  facebookLink: {
    type: String,
  },
  role: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});

const clubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    unique: true,
  },
  clubDescription: {
    type: String,
  },
  category: {
    type: String,
  },
  contactInfo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  boardMembers: [boardMemberSchema],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Reference to Events
});

// Hash the password before saving
clubSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
