import { Response } from 'express';
import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { petId, message } = req.body;

    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.isAdopted) {
      return res.status(400).json({ message: 'Pet is already adopted' });
    }

    // Check if request already exists
    const existingRequest = await AdoptionRequest.findOne({
      adopter: req.user?.id,
      pet: petId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested to adopt this pet' });
    }

    const request = await AdoptionRequest.create({
      adopter: req.user?.id,
      pet: petId,
      shelter: pet.shelter,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    let query = {};
    
    if (req.user?.role === 'shelter') {
      query = { shelter: req.user.id };
    } else {
      query = { adopter: req.user?.id };
    }

    const requests = await AdoptionRequest.find(query)
      .populate('adopter', 'firstName lastName username profileImage email phone')
      .populate('pet', 'name image species breed')
      .populate('shelter', 'firstName lastName username profileImage')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.shelter.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    const updatedRequest = await request.save();

    // If approved, mark pet as adopted
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(request.pet, { isAdopted: true });
      
      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        { pet: request.pet, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
