const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../Models/AdoptionRequest');

// url: http://localhost:5000/api/request/newRequest
router.post('/newRequest', async (req,res) => {
    try {
        const { adopter, pet, shelter, status, message, requestedAt} = req.body;

        if( !adopter || !pet || !shelter) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newRequest = new AdoptionRequest({
            adopter, pet, shelter, status, message, 
            requestedAt : requestedAt || new Date(),
        })

        const saveRequest = await newRequest.save();
        res.status(201).json(saveRequest);
    } catch (error) {
        console.error('Error registering Request:', error);
        res.status(500).json({ error: 'Server eroor'});
    }
})

module.exports = router;