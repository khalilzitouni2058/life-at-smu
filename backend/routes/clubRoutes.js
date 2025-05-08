const express = require("express");
const { getAllClubs, adminCreateClub, deleteClubById } = require("../Controllers/clubController");


const router = express.Router();

router.get("/clubs", getAllClubs);
router.post("/admin-create", adminCreateClub);
router.delete("/delete-clubs/:id", deleteClubById);
module.exports = router;
