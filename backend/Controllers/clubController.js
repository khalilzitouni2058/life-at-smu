const Club = require("../models/clubs");

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json({ success: true, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

const adminCreateClub = async (req, res) => {
  const { email, clubName, profilePicture } = req.body;

  // Create club
  const newClub = new Club({
    email,
    password: 123456,
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

const deleteClubById = async (req, res) => {
  const { id } = req.params._id;
  

  try {
    const deletedClub = await Club.findByIdAndDelete(id);

    if (!deletedClub) {
      return res.status(404).json({ message: id });
    }

    return res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Error deleting club:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllClubs, adminCreateClub,deleteClubById };
