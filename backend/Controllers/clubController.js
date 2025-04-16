const Club = require("../models/clubs");
const crypto = require("crypto");

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json({ success: true, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};


const adminCreateClub = async (req, res) => {
  const { clubName, profilePicture } = req.body;

    // Create club
    const newClub = new Club({
      email,
      password: generatedPassword, 
      clubName,
      profilePicture:
        profilePicture ||
        "https://cdn-icons-png.flaticon.com/128/16745/16745734.png",
      clubDescription: "",
      category: "",
      contactInfo: "",
      boardMembers: [],
    });

    await newClub.save();

};
module.exports = { getAllClubs, adminCreateClub };
