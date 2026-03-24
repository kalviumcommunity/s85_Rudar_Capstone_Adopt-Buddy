import express from 'express';
import { getChats, getChatById, createOrGetChat, sendMessage } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getChats)
  .post(protect, createOrGetChat);

router.route('/:id')
  .get(protect, getChatById)
  .post(protect, sendMessage);

export default router;
