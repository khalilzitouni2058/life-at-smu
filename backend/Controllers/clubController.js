const Club = require("../models/clubs");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

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

  if (!email || !clubName) {
    return res.status(400).json({ message: "Email and club name are required." });
  }

  try {
    // Check for duplicates
    const existingClub = await Club.findOne({ email });
    if (existingClub) {
      return res.status(400).json({ message: "A club with this email already exists." });
    }

    // Generate random password
    const generatedPassword = crypto.randomBytes(8).toString("hex");

    // Create club
    const newClub = new Club({
      email,
      password: generatedPassword, // Will be hashed via schema pre("save")
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

    // Send welcome email
    await sendMail({
      to: email,
      subject: "🎉 Welcome to the Clubs Platform",
      html: `
        <h2>Hello ${clubName},</h2>
        <p>Your club account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${generatedPassword}</p>
        <p>You can login here: <a href="https://your-app.com/login">Login</a></p>
        <p>Make sure to change your password after logging in.</p>
      `,
    });

    res.status(201).json({ message: "Club created and email sent successfully." });
  } catch (err) {
    console.error("Admin Create Club Error:", err);
    res.status(500).json({ message: "Server error creating club", error: err.message });
  }
};
module.exports = { getAllClubs, adminCreateClub };
