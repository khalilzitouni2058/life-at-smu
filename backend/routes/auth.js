const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Club = require("../models/clubs");
const Event = require("../models/events");
const Room = require("../models/rooms");

const studentLifeDeps = require("../models/studentLifeDeps");

router.post("/student-life-dep", async (req, res) => {
  try {
    const { email, fullname, role, picture, program, major } = req.body;
    let user = await studentLifeDeps.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists in Student Life Department" });
    }

    user = new studentLifeDeps({
      email,
      fullname,
      role,
      picture,
      program,
      major,
    });
    await user.save();

    res
      .status(201)
      .json({ message: "User added to Student Life Department", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

router.post('/events/approve', async (req, res) => {
  try {
    const { eventId } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: 'Approved' },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event approved', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error approving event', error });
  }
});
router.post('/events/decline', async (req, res) => {
  try {
    const { eventId } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: 'Declined' },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event declined', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error declining event', error });
  }
});
router.get('/student-life-dep', async (req, res) => {

  try {
    const users = await studentLifeDeps.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        picture: user.picture,
        program: user.program,
        major: user.major,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});
router.post("/signup", async (req, res) => {
  const { email, fullname, password, picture, program, major } = req.body;

  // Validate input
  if (!email || !fullname || !password || !program || !major) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const defaultProfilePic =
      "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg";

    // Create new user
    const newUser = new User({
      email,
      fullname,
      password,
      picture: picture || defaultProfilePic,
      program,
      major,
    });

    // Save the new user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const existing = await User.findOne({ email });
  res.json({ exists: !!existing });
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users && users.length > 0) {
      return res.status(200).json({ users: users });
    } else {
      return res.status(404).json({ msg: "No users found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error onn getting users" });
  }
});

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const foundUser = await User.findById(id);
    if (foundUser) {
      res.status(200).json({ user: foundUser });
    } else {
      res.status(404).json({ msg: "No user found with the given ID" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Error on retrieving the user" });
  }
});

router.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  console.log(user);
  try {
    await User.findByIdAndUpdate(id, user);
    res.status(200).json({ msg: "update success" });
  } catch (error) {
    res.status(400).json({ msg: "error on updating user" });
  }
});

// Push an event ID to the user's events array
router.post("/users/:id/events", async (req, res) => {
  const userId = req.params.id;
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "eventId is required" });
  }

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Avoid duplicates
    if (user.events.includes(eventId)) {
      return res.status(400).json({ message: "User already joined this event" });
    }

    user.events.push(eventId);
    await user.save();

    res.status(200).json({ message: "Event added to user", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// This route will fetch all events of a specific user
router.get("/users/:id/events", async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the user by ID, including their events
    const user = await User.findById(userId).populate("events");  // Assuming `events` is populated with event details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's events
    res.status(200).json({ events: user.events });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Club Signup Route
router.post("/clubs/signup", async (req, res) => {
  const { email, password, clubName } = req.body;

  // Validate input
  if (!email || !password || !clubName) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the club already exists
    const existingClub = await Club.findOne({ email });
    if (existingClub) {
      return res.status(400).json({ message: "Club already exists" });
    }

    // Create new club with empty fields
    const newClub = new Club({
      email,
      password,
      clubName,
      clubDescription: "",
      category: "",
      contactInfo: "",
      profilePicture:
        "https://cdn-icons-png.flaticon.com/128/16745/16745734.png",
      boardMembers: [],
    });

    // Save the new club to the database
    await newClub.save();

    // Create JWT token
    const token = jwt.sign(
      { clubId: newClub._id, email: newClub.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Club created successfully",
      token,
      club: {
        _id: newClub._id,
        email: newClub.email,
        clubName: newClub.clubName,
        clubDescription: newClub.clubDescription,
        category: newClub.category,
        contactInfo: newClub.contactInfo,
        profilePicture: newClub.profilePicture,
        boardMembers: newClub.boardMembers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Club Login Route
router.post("/clubs/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find club by email
    const club = await Club.findOne({ email });
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { clubId: club._id, email: club.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      club: {
        _id: club._id,
        email: club.email,
        clubName: club.clubName,
        clubDescription: club.clubDescription,
        category: club.category,
        contactInfo: club.contactInfo,
        profilePicture: club.profilePicture,
        boardMembers: club.boardMembers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get All Clubs
router.get("/clubs", async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update Club
router.put("/clubs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    clubName,
    clubDescription,
    category,
    contactInfo,
    profilePicture,
    boardMembers,
  } = req.body;

  try {
    const updatedClub = await Club.findByIdAndUpdate(
      id,
      {
        clubName,
        clubDescription,
        category,
        contactInfo,
        profilePicture,
        boardMembers,
      },
      { new: true, runValidators: true }
    );

    if (!updatedClub) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({
      message: "Club updated successfully",
      club: {
        _id: updatedClub._id,
        email: updatedClub.email,
        clubName: updatedClub.clubName,
        clubDescription: updatedClub.clubDescription,
        category: updatedClub.category,
        contactInfo: updatedClub.contactInfo,
        profilePicture: updatedClub.profilePicture,
        boardMembers: updatedClub.boardMembers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Club Details by ID
router.get("/clubs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const club = await Club.findById(id).populate(
      "boardMembers.user",
      "fullname picture email"
    );
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add Board Member for Clubs
router.put("/clubs/:id/add-board-member", async (req, res) => {
  const { id } = req.params;
  const { email, role, phoneNumber, facebookLink } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const club = await Club.findById(id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyExists = club.boardMembers.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "User is already a board member" });
    }

    club.boardMembers.push({
      user: user._id,
      role,
      phoneNumber,
      facebookLink,
    });

    await club.save();

    const updatedClub = await Club.findById(id).populate(
      "boardMembers.user",
      "fullname email picture"
    );

    res.status(200).json({ message: "Board member added", club: updatedClub });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Board Member of a Club
router.put("/clubs/:clubId/update-board-member", async (req, res) => {
  const { clubId } = req.params;
  const { userId, role, phoneNumber, facebookLink } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Find the board member by user ID
    const memberIndex = club.boardMembers.findIndex(
      (m) => m.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: "Board member not found" });
    }

    // Update the relevant fields
    if (role) club.boardMembers[memberIndex].role = role;
    if (phoneNumber) club.boardMembers[memberIndex].phoneNumber = phoneNumber;
    if (facebookLink)
      club.boardMembers[memberIndex].facebookLink = facebookLink;

    await club.save();

    const updatedClub = await Club.findById(clubId).populate(
      "boardMembers.user",
      "fullname email picture"
    );

    res.status(200).json({
      message: "Board member updated successfully",
      club: updatedClub,
    });
  } catch (err) {
    console.error("Error updating board member:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/user-by-email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new event for a club
router.post("/clubs/:clubId/events", async (req, res) => {
  const { clubId } = req.params;
  const {
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventLocation,
    additionalNotes,
    eventImage,
    room,
    mandatoryParentalAgreement,
    transportationProvided,
    formLink,
  } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const newEvent = new Event({
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventLocation,
      additionalNotes,
      eventImage,
      formLink,
      club: clubId,
      room,
      mandatoryParentalAgreement: mandatoryParentalAgreement ?? false,
      transportationProvided: transportationProvided ?? false,
      status: "Waiting", // ✅ Default status is "Waiting"
    });

    await newEvent.save();

    club.events.push(newEvent._id);
    await club.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all events for a club
router.get("/clubs/:clubId/events", async (req, res) => {
  const { clubId } = req.params;

  try {
    const club = await Club.findById(clubId).populate("events");
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({ events: club.events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/events/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const events = await Event.find({ eventDate: date })
      .populate("club", "clubName profilePicture") // Populate club with clubName and profilePicture
      .select(
        "eventName eventDescription eventDate eventTime eventLocation additionalNotes eventImage club mandatoryParentalAgreement transportationProvided status formLink"
      );

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No events found for the specified date." });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().select(
      "eventName eventDescription eventDate eventTime eventLocation additionalNotes eventImage club mandatoryParentalAgreement transportationProvided status formLink"
    );

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!Room.available) {
      return res.status(200).json({ rooms: rooms });
    } else {
      return res.status(404).json({ msg: "No available rooms found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error on getting rooms" });
  }
});

module.exports = router;
