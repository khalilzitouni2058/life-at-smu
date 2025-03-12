const Club = require("../models/clubs"); 

const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json({ success: true, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};


module.exports = { getAllClubs };
