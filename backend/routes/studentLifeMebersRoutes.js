

const express = require('express');
const router = express.Router();
const studentLifeController = require('../Controllers/studentLifeMebersController');


router.delete('/delete-user/:userId', studentLifeController.deleteUserFromStudentLifeDep);

module.exports = router;
