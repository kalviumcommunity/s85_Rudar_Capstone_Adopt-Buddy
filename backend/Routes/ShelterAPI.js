const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const Shelter = require('../Models/Shelter');

// ✅ Cloudinary storage configuration using multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'adopt-buddy-Shelter', // Folder in Cloudinary for shelter images
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Limit image size
    },
});

const upload = multer({ storage });

/**
 * @route   POST /api/shelter/addshelter
 * @desc    ✅ WRITE Operation: Create a new shelter with optional image upload
 * @access  Public
 */
router.post('/addshelter', upload.single('shelterImage'), async (req, res) => {
    try {
        const { name, address, phone, email, description, website, staffMembers, petsAvailable, createdAt } = req.body;

        // ✅ Check for required fields
        if (!name || !address || !phone || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Upload image to Cloudinary and get URL
        const shelterImage = req.file ? req.file.path : null;

        // ✅ Store shelter info in MongoDB
        const newShelter = new Shelter({
            name, address, phone, email, description, website, shelterImage, staffMembers, petsAvailable,
            createdAt: createdAt || new Date(),
        });

        const saveShelter = await newShelter.save(); // ← Mongoose WRITE operation
        res.status(201).json(saveShelter);
    } catch (error) {
        console.error('Error registering Shelter:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/shelter/shelters
 * @desc    ✅ READ Operation: Get all shelters
 * @access  Public
 */
router.get('/shelters', async (req, res) => {
    try {
        const shelters = await Shelter.find(); // ← Mongoose READ operation
        res.status(200).json(shelters);
    } catch (err) {
        console.error('Error fetching shelters:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/shelter/shelters/:id
 * @desc    ✅ READ Operation: Get shelter details by ID
 * @access  Public
 */
router.get('/shelters/:id', async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id); // ← READ by ID
        if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
        res.status(200).json(shelter);
    } catch (err) {
        console.error('Error fetching shelter by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   PUT /api/shelter/shelters/:id
 * @desc    ✅ WRITE Operation: Update shelter details (image included)
 * @access  Public
 */
router.put('/shelters/:id', upload.single('shelterImage'), async (req, res) => {
    try {
        const shelterId = req.params.id;
        const updateData = req.body;

        // ✅ If new image uploaded, update it
        if (req.file) {
            updateData.shelterImage = req.file.path;
        }

        const updatedShelter = await Shelter.findByIdAndUpdate(
            shelterId,
            updateData,
            { new: true, runValidators: true } // ← WRITE operation with validation
        );

        if (!updatedShelter) {
            return res.status(404).json({ error: 'Shelter not found' });
        }

        res.status(200).json(updatedShelter);
    } catch (error) {
        console.error('Error updating shelter:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
/**
 * @route   DELETE /api/shelter/shelters/:id
 * @desc    ❌ DELETE Operation: Delete shelter by ID
 * @access  Public (⚠️ Recommend protecting this in the future)
 */
router.delete('/shelters/:id', async (req, res) => {
    try {
        const deletedShelter = await Shelter.findByIdAndDelete(req.params.id);

        if (!deletedShelter) {
            return res.status(404).json({ error: 'Shelter not found' });
        }

        res.status(200).json({ message: 'Shelter deleted successfully' });
    } catch (err) {
        console.error('Error deleting shelter:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
