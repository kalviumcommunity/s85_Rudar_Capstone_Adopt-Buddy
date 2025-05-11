const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../Models/AdoptionRequest');

// url: http://localhost:5000/api/request/newRequest
router.post('/newRequest', async (req, res) => {
    try {
        const { adopter, pet, shelter, status, message, requestedAt } = req.body;

        if (!adopter || !pet || !shelter) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newRequest = new AdoptionRequest({
            adopter, pet, shelter, status, message,
            requestedAt: requestedAt || new Date(),
        });

        const saveRequest = await newRequest.save();
        res.status(201).json(saveRequest);
    } catch (error) {
        console.error('Error registering Request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------------- GET Routes ----------------

// Get all adoption requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await AdoptionRequest.find();
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get adoption request by ID
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await AdoptionRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.status(200).json(request);
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
