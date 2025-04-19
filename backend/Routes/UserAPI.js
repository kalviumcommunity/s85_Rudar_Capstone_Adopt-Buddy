const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const User = require('../Models/User');

// Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'adopt-buddy-profiles', // cloud folder name
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// Route to register a user with profile image
router.post('/sign-up', upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role, phone, address, bio } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.path : null;

    const newUser = new User({
      firstName, lastName, username, email,
      password: hashedPassword,
      role, phone, address, bio, profileImage,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
