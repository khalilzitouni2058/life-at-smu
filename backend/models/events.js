const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    eventLocation: { type: String, required: true },
    additionalNotes: { type: String },
    eventImage: { uri: String },
    
    // ✅ Change from single room to array of rooms
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    ],
    
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    mandatoryParentalAgreement: { type: Boolean, default: false },
    transportationProvided: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Waiting", "Approved", "Declined"],
      default: "Waiting",
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
