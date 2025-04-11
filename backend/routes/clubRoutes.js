const express = require("express");
const { getAllClubs } = require("../Controllers/clubController");

const router = express.Router();

router.get("/clubs", getAllClubs);

module.exports = router;
