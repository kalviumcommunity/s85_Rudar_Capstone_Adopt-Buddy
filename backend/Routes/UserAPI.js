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

// ---------------- GET Routes ----------------

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Optionally use .select('-password') to hide passwords
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user by ID
router.put('/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // If a new profile image is uploaded
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
