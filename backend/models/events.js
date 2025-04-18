const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String },
    eventDate: { type: String, required: true }, // Store as a string (ISO format) or Date
    eventTime: { type: String, required: true }, // Store as string (e.g., "14:00" or "2:00 PM")
    eventLocation: { type: String, required: true },
    additionalNotes: { type: String },
    eventImage: { uri: String }, // Store image URL or file path
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true }, // Reference to Club
    mandatoryParentalAgreement: { type: Boolean, default: false }, // New Boolean field
    transportationProvided: { type: Boolean, default: false }, // New Boolean field
    status: {
      type: String,
      enum: ["Waiting", "Approved", "Declined"], // Only allows these values
      default: "Waiting", // Default value if none is provided
    },
    formLink: {
      type: String,
      required: true,
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentLifeDeps",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
