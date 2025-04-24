// controllers/stats.controller.js
const User = require("../models/users");
const Event = require("../models/events");
const Club = require("../models/clubs");
const Officer = require("../models/studentLifeDeps");

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    res.json({ totalUsers, newUsers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

const getOfficerStats = async (req, res) => {
  try {
    const officerCount = await Officer.countDocuments({ role: "Officer" });
    res.json({ officerCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch officer stats" });
  }
};

const getEventStats = async (req, res) => {
  try {
    const now = new Date().toISOString();
    const upcoming = await Event.countDocuments({ eventDate: { $gte: now } });
    const past = await Event.countDocuments({ eventDate: { $lt: now } });
    const events = await Event.find({}, "eventName assignedMembers");

    const participationStats = events.map((e) => ({
      name: e.eventName,
      participants: e.assignedMembers.length,
    }));

    res.json({ upcoming, past, participationStats });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event stats" });
  }
};

const getFacebookStats = async (req, res) => {
  res.json({
    likes: 1320,
    shares: 488,
    reach: 9345,
  });
};

const getInstagramStats = async (req, res) => {
  res.json({
    followers: 2500,
    reach: 7500,
    topPosts: [
      { title: "Club Fair Recap", likes: 124, shares: 18 },
      { title: "Meet Our Team", likes: 98, shares: 12 },
    ],
  });
};

module.exports = {
  getUserStats,
  getOfficerStats,
  getEventStats,
  getFacebookStats,
  getInstagramStats,
};
