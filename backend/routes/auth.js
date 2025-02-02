const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');  


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: '2h' } 
    );

    
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        fullname: user.fullname,
        picture: user.picture,
        program: user.program,
        major: user.major,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/signup', async (req, res) => {
  const { email, fullname, password, picture, program, major } = req.body;

  // Validate input
  if (!email || !fullname || !password || !program || !major) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    

    // Create new user
    const newUser = new User({
      email,
      fullname,
      password,
      picture,
      program,
      major
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get("/users",async (req,res) =>{

  try{
    const users = await User.find()
    if(users && users.length>0){
       return res.status(200).json({users : users});
    }else{
       return res.status(404).json({msg: "No users found"});
    }
}catch(error){
    console.error(error);
   return res.status(500).json({msg:"Error onn getting users"});
}

});

router.get("/users/:id",async (req,res) =>{

  const id = req.params.id;
    try {
        const foundUser = await User.findById(id);
        if (foundUser) {
            res.status(200).json({ user: foundUser });
        } else {
            res.status(404).json({ msg: "No user found with the given ID" });
        }
    }catch (error) {
        res.status(500).json({ msg: "Error on retrieving the user" });
    }

});

router.put("/users/:id",async (req,res) =>{

  const id = req.params.id;
  const user=req.body
  console.log(user)
  try {
      await User.findByIdAndUpdate(id,user)
      res.status(200).json({ msg: "update success" });
  }catch (error){
      res.status(400).json({ msg: "error on updating user" });
  }

});

module.exports = router;
