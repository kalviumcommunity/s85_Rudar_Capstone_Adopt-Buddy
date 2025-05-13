const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const User = require('../Models/User');

// ✅ Multer storage config using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'adopt-buddy-profiles', // Cloud folder for profile images
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/user/login
 * @desc    ✅ LOGIN Operation: Authenticate a user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Determine whether identifier is an email or username
    const isEmail = identifier.includes('@');

    // Find user by email or username
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    // No user found
    if (!user) {
      return res.status(400).json({
        error: isEmail ? 'Invalid email' : 'Invalid username',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Success
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/user/sign-up
 * @desc    ✅ WRITE Operation: Register a new user with profile image and hashed password
 * @access  Public
 */
router.post('/sign-up', upload.single('profileImage'), async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role, phone, address, bio } = req.body;

    // ✅ Required fields check
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Secure password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Get Cloudinary image URL if uploaded
    const profileImage = req.file ? req.file.path : null;

    // ✅ Create new user object
    const newUser = new User({
      firstName, lastName, username, email,
      password: hashedPassword,
      role, phone, address, bio, profileImage,
    });

    const savedUser = await newUser.save(); // ← Mongoose WRITE
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/user/users
 * @desc    ✅ READ Operation: Get all users
 * @access  Public
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // ← Mongoose READ
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/user/users/:id
 * @desc    ✅ READ Operation: Get user by ID
 * @access  Public
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // ← READ by ID
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/user/users/:id
 * @desc    ✅ WRITE Operation: Update user details (including optional image and password)
 * @access  Public
 */
router.put('/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // ✅ If new profile image is uploaded
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // ✅ If password is being updated, re-hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // ← WRITE operation with validation
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
