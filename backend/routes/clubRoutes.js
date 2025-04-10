const express = require("express");
const { getAllClubs, adminCreateClub } = require("../Controllers/clubController");

const router = express.Router();


router.get("/clubs", getAllClubs);
router.post("/admin-create", adminCreateClub);

module.exports = router;
