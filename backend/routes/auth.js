const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Club = require("../models/clubs");
const Event = require("../models/events");

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
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
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
      clubName: "",
      clubDescription: "",
      category: "",
      contactInfo: "",
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
        boardMembers: club.boardMembers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/clubs/:id", async (req, res) => {
  const { id } = req.params;
  const { clubName, clubDescription, category, contactInfo, boardMembers } =
    req.body;

  try {
    const updatedClub = await Club.findByIdAndUpdate(
      id,
      { clubName, clubDescription, category, contactInfo, boardMembers },
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
        boardMembers: updatedClub.boardMembers,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new event for a club
router.post('/clubs/:clubId/events', async (req, res) => {
  const { clubId } = req.params;
  const { eventName, eventDescription, eventDate, eventTime, eventLocation, additionalNotes, eventImage } = req.body;

  if (!eventName || !eventDate || !eventTime || !eventLocation) {
      return res.status(400).json({ message: 'Event name, date, time, and location are required' });
  }

  try {
      const club = await Club.findById(clubId);
      if (!club) {
          return res.status(404).json({ message: 'Club not found' });
      }

      const newEvent = new Event({
          eventName,
          eventDescription,
          eventDate,
          eventTime,
          eventLocation,
          additionalNotes,
          eventImage,
          club: clubId
      });

      await newEvent.save();

      // Add event to the club's event list
      club.events.push(newEvent._id);
      await club.save();

      res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all events for a club
router.get('/clubs/:clubId/events', async (req, res) => {
  const { clubId } = req.params;

  try {
      const club = await Club.findById(clubId).populate('events');
      if (!club) {
          return res.status(404).json({ message: 'Club not found' });
      }

      res.status(200).json({ events: club.events });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
