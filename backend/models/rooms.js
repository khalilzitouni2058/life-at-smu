const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  Available: {
    type: Boolean,
    default: false, 
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
