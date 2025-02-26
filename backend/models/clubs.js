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
  profilePicture: {
    type: String, 
    default: "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/469963732_2801171663397034_3870197941446985944_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uqzP4t61bloQ7kNvgGuZweS&_nc_oc=AdiZi3rCnmG1hpiNhZIlx-rDtV1XEM0uwGxQef6qz8dJ724A7BKL5cPjYMLA5Di_4-4&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=Akr1sLeZP0dLZ-JjE-afwYi&oh=00_AYAjfD91fKYDbB1FqX_D4lx-qx5KrgPJCj9enbH2X8cEIg&oe=67AFB8AB",
  },
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
    default: "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/469963732_2801171663397034_3870197941446985944_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uqzP4t61bloQ7kNvgGuZweS&_nc_oc=AdiZi3rCnmG1hpiNhZIlx-rDtV1XEM0uwGxQef6qz8dJ724A7BKL5cPjYMLA5Di_4-4&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=Akr1sLeZP0dLZ-JjE-afwYi&oh=00_AYAjfD91fKYDbB1FqX_D4lx-qx5KrgPJCj9enbH2X8cEIg&oe=67AFB8AB",
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
