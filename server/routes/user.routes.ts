import express from 'express';
import { getMe, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/update', protect, upload.single('profileImage'), updateProfile);

export default router;
