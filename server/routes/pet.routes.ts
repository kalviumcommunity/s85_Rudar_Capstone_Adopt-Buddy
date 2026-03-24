import express from 'express';
import { createPet, getPets, getPetById, updatePet, deletePet } from '../controllers/pet.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getPets)
  .post(protect, authorize('shelter'), upload.single('image'), createPet);

router.route('/:id')
  .get(getPetById)
  .put(protect, authorize('shelter'), upload.single('image'), updatePet)
  .delete(protect, authorize('shelter'), deletePet);

export default router;
