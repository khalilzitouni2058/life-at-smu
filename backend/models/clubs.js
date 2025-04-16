const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const boardMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String },
  phoneNumber: { type: String },
  facebookLink: { type: String },
});

const clubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
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
  profilePicture: {
    type: String,
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
  isRecruiting: {
    type: Boolean,
    default: false,
  },

  boardMembers: [boardMemberSchema],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pendingRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Hash the password before saving
clubSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
