const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../DataBase/cloudinary');
const Shelter = require('../Models/Shelter');

// Cloudinary storage setup for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'adopt-buddy-Shelter', // cloud folder name
        allowed_formats: ['jpg','jpeg','png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
});

const upload = multer({storage});

// Route to register a Shelter with image
// url: 
router.post('/addshelter',upload.single('shelterImage'), async (req,res) => {
    try {
        const { name, address, phone, email, description, website, staffMembers, petsAvailable, createdAt } = req.body;

        if( !name || !address || !phone || !email ){
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const shelterImage = req.file? req.file.path : null;

        const newShelter = new Shelter({
            name, address, phone, email, description, website, shelterImage, staffMembers, petsAvailable, 
            createdAt: createdAt || new Date(),
        });

        const saveShelter = await newShelter.save();
        res.status(201).json(saveShelter);
    } catch (error) {
        console.error('Error registering Shelter:', error);
        res.status(500).json({ error: 'Server eroor'});
    }
})

module.exports = router;