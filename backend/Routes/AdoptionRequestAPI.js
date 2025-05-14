const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../Models/AdoptionRequest');

/**
 * @route   POST /api/request/newRequest
 * @desc    ✅ WRITE Operation: Create and save a new adoption request to MongoDB
 * @access  Public
 */
router.post('/newRequest', async (req, res) => {
    try {
        const { adopter, pet, shelter, status, message, requestedAt } = req.body;

        // ✅ Validating required input fields before write
        if (!adopter || !pet || !shelter) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ✅ Writing data to database
        const newRequest = new AdoptionRequest({
            adopter,
            pet,
            shelter,
            status,
            message,
            requestedAt: requestedAt || new Date(),
        });

        const saveRequest = await newRequest.save(); // ← Mongoose WRITE operation
        res.status(201).json(saveRequest);
    } catch (error) {
        console.error('Error registering Request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------------- GET Routes ----------------

/**
 * @route   GET /api/request/requests
 * @desc    ✅ READ Operation: Fetch all adoption requests from MongoDB
 * @access  Public
 */
router.get('/requests', async (req, res) => {
    try {
        const requests = await AdoptionRequest.find(); // ← Mongoose READ operation
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   GET /api/request/requests/:id
 * @desc    ✅ READ Operation: Fetch a specific request by ID
 * @access  Public
 */
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await AdoptionRequest.findById(req.params.id); // ← READ by ID
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (err) {
        console.error('Error fetching request by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   PUT /api/request/requests/:id
 * @desc    ✅ WRITE Operation: Update an existing request
 * @access  Public
 */
router.put('/requests/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const requestId = req.params.id;

        const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
            requestId,
            updatedData,
            { new: true, runValidators: true } // ← WRITE with validation
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @route   DELETE /api/request/requests/:id
 * @desc    ❌ DELETE Operation: Delete an adoption request by ID
 * @access  Public (⚠️ Should be protected in real-world apps)
 */
router.delete('/requests/:id', async (req, res) => {
    try {
        const deletedRequest = await AdoptionRequest.findByIdAndDelete(req.params.id);

        if (!deletedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json({ message: 'Adoption request deleted successfully' });
    } catch (err) {
        console.error('Error deleting request:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
