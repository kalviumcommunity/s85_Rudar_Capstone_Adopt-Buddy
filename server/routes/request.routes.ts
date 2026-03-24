import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/request.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getRequests)
  .post(protect, authorize('adopter'), createRequest);

router.route('/:id')
  .put(protect, authorize('shelter'), updateRequestStatus);

export default router;
