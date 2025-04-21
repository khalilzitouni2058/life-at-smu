const mongoose = require("mongoose");

// Subdocument schema for a reservation
const reservationSchema = new mongoose.Schema({
  DayOfReservation: {
    type: Date, // or String if you want a specific format
    required: true,
  },
  TimeInterval: {
    start: {
      type: String, // Example: "10:00"
      required: true,
    },
    end: {
      type: String, // Example: "12:00"
      required: true,
    },
  },
});

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  reservations: [reservationSchema], 
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
