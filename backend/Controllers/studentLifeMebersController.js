// controllers/studentLifeController.js

const StudentLife = require('../models/studentLifeDeps'); // Assuming your model for student life is 'StudentLife'


exports.deleteUserFromStudentLifeDep = async (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters

  try {
    // Find and delete the user from the studentlifedeps collection
    const deletedUser = await StudentLife.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found in Student Life Department' });
    }

    return res.status(200).json({ message: 'User successfully deleted from Student Life Department' });
  } catch (error) {
    console.error('Error deleting user from Student Life Department:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
