const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Club = require("../models/clubs");
const Event = require("../models/events");
const Room = require("../models/rooms");

const studentLifeDeps = require("../models/studentLifeDeps")

router.post('/student-life-dep', async (req, res) => {
  try {
    const { email, fullname, role } = req.body;
    let user = await studentLifeDeps.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists in Student Life Department' });
    }

    user = new studentLifeDeps({ email, fullname, role });
    await user.save();

    res.status(201).json({ message: 'User added to Student Life Department', user });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
});
router.get('/student-life-dep', async (req, res) => {
  try {
    const users = await studentLifeDeps.find(); 
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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

    // Hash the password

    // Create new user
    const newUser = new User({
      email,
      fullname,
      password,
      picture,
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
        "https://scontent.ftun8-1.fna.fbcdn.net/v/t39.30808-6/469963732_2801171663397034_3870197941446985944_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=uqzP4t61bloQ7kNvgGuZweS&_nc_oc=AdiZi3rCnmG1hpiNhZIlx-rDtV1XEM0uwGxQef6qz8dJ724A7BKL5cPjYMLA5Di_4-4&_nc_zt=23&_nc_ht=scontent.ftun8-1.fna&_nc_gid=Akr1sLeZP0dLZ-JjE-afwYi&oh=00_AYAjfD91fKYDbB1FqX_D4lx-qx5KrgPJCj9enbH2X8cEIg&oe=67AFB8AB",
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
    const club = await Club.findById(id).populate("boardMembers"); // Populate events if needed
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
  const { name, email, facebookLink, role, phoneNumber, profilePicture } =
    req.body;

  try {
    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // ✅ Append new board member to existing list
    club.boardMembers.push({
      name,
      email,
      facebookLink,
      role,
      phoneNumber,
      profilePicture,
    });

    await club.save(); // ✅ Save the updated club

    res.status(200).json({ message: "Board member added successfully", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Board Members of a Club
router.put("/clubs/:clubId/update-board-member", async (req, res) => {
  const { clubId } = req.params;
  const { name, email, facebookLink, role, phoneNumber, profilePicture } =
    req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Find the board member by email and update their details
    const memberIndex = club.boardMembers.findIndex((m) => m.email === email);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Board member not found" });
    }

    club.boardMembers[memberIndex] = {
      name,
      email,
      facebookLink,
      role,
      phoneNumber,
      profilePicture,
    };

    await club.save();

    res
      .status(200)
      .json({ message: "Board member updated successfully", club });
  } catch (err) {
    console.error("Error updating board member:", err);
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
  } = req.body;


  if (!eventName || !eventDate || !eventTime || !eventLocation || !room) {
    return res.status(400).json({
      message: "Event name, date, time, location, and room are required",
    });
  }


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
      club: clubId,
      room, // Store room ID
    });

    await newEvent.save();

    // Add event to the club's event list
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
      .populate("club", "clubName profilePicture")
      .select(
        "eventName eventDescription eventDate eventTime eventLocation additionalNotes eventImage club"
      );

    // ✅ Always return 200 with the data (even if empty)
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().select(
      "eventName eventDescription eventDate eventTime eventLocation additionalNotes eventImage club"
    );

    res.status(200).json(events);
  } catch (error) {
    res.json({ message: "Server error", error: error.message });
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
