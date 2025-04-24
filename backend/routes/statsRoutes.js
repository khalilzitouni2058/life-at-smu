// routes/stats.routes.js
const express = require("express");
const router = express.Router();
const {
  getUserStats,
  getOfficerStats,
  getEventStats,
  getFacebookStats,
  getInstagramStats,
} = require("../controllers/statsController");

// User stats
router.get("/users", getUserStats);

// Officer stats
router.get("/officers", getOfficerStats);

// Event stats
router.get("/events", getEventStats);

// Social Media - Facebook
router.get("/social/facebook", getFacebookStats);

// Social Media - Instagram
router.get("/social/instagram", getInstagramStats);

module.exports = router;
