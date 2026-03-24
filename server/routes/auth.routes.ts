import express from 'express';
import { body } from 'express-validator';
import { signup, login, logout, refresh } from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['adopter', 'shelter']).withMessage('Role must be adopter or shelter'),
  ],
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  login
);

router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
