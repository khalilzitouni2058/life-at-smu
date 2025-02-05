const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDescription: { type: String },
  eventDate: { type: String, required: true }, // Store as a string (ISO format) or Date
  eventTime: { type: String, required: true }, // Store as string (e.g., "14:00" or "2:00 PM")
  eventLocation: { type: String, required: true },
  additionalNotes: { type: String },
  eventImage: { type: String }, // Store image URL or file path
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true }, // Reference to Club
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
