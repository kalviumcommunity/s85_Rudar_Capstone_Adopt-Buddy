const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const Pet = require('../Models/Pet');

// Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'adopt-buddy-petProfiles', // cloud folder name
        allowed_formats: ['jpg','jpeg','png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

const upload = multer({storage});

// Route to register a pet with image
// url : http://localhost:5000/api/pet/addpet
router.post('/addpet',upload.single('image'), async (req,res) => {
    try {
        const { name, age, species, breed, gender, description, shelter, isAdopted, postedAt} = req.body;

        if (!name || !age || !species || !breed || !gender || !description || !shelter) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const image = req.file ? req.file.path : null;
        if( !image ){
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newPet = new Pet({
            name, age, species, breed, gender, description, image, shelter, isAdopted, 
            postedAt: postedAt || new Date(),
        });

        const savePet = await newPet.save();
        res.status(201).json(savePet);
    } catch (error) {
        console.error('Error registering pet:', error);
        res.status(500).json({ error: 'Server error'});
    }
});

module.exports = router;