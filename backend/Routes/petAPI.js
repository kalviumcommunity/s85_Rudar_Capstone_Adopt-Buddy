const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const Pet = require('../Models/Pet');

// ✅ Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'adopt-buddy-petProfiles', // Folder in your Cloudinary account
        allowed_formats: ['jpg','jpeg','png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Resize constraints
    },
});

const upload = multer({ storage });

/**
 * @route   POST /api/pet/addpet
 * @desc    ✅ WRITE Operation: Create a new pet profile with image upload
 * @access  Public
 */
router.post('/addpet', upload.single('image'), async (req, res) => {
    try {
        const { name, age, species, breed, gender, description, shelter, isAdopted, postedAt } = req.body;

        // ✅ Validating required input fields
        if (!name || !age || !species || !breed || !gender || !description || !shelter) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Handling image upload
        const image = req.file ? req.file.path : null;
        if (!image) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Writing pet data to MongoDB
        const newPet = new Pet({
            name, age, species, breed, gender, description, image, shelter, isAdopted,
            postedAt: postedAt || new Date(),
        });

        const savePet = await newPet.save(); // ← Mongoose WRITE operation
        res.status(201).json(savePet);
    } catch (error) {
        console.error('Error registering pet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/pet/pets
 * @desc    ✅ READ Operation: Fetch all pet profiles from MongoDB
 * @access  Public
 */
router.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find(); // ← Mongoose READ operation
        res.status(200).json(pets);
    } catch (err) {
        console.error('Error fetching pets:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/pet/pets/:id
 * @desc    ✅ READ Operation: Get specific pet details by ID
 * @access  Public
 */
router.get('/pets/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id); // ← READ by ID
        if (!pet) return res.status(404).json({ error: 'Pet not found' });
        res.status(200).json(pet);
    } catch (err) {
        console.error('Error fetching pet by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   PUT /api/pet/pets/:id
 * @desc    ✅ WRITE Operation: Update pet details (including image) by ID
 * @access  Public
 */
router.put('/pets/:id', upload.single('image'), async (req, res) => {
    try {
        const petId = req.params.id;
        const updateData = req.body;

        // ✅ If image is included in update, store new Cloudinary path
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            petId,
            updateData,
            { new: true, runValidators: true } // ← Mongoose WRITE operation
        );

        if (!updatedPet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        res.status(200).json(updatedPet);
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
