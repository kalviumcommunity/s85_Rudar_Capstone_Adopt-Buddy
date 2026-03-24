import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../utils/jwt.js';
import { validationResult } from 'express-validator';

export const signup = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, username, email, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      const { accessToken, refreshToken } = generateTokens(user.id, user.role);
      setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password!))) {
      const { accessToken, refreshToken } = generateTokens(user.id, user.role);
      setTokenCookies(res, accessToken, refreshToken);

      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  clearTokenCookies(res);
  res.json({ message: 'Logged out successfully' });
};

export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);
    
    setTokenCookies(res, accessToken, newRefreshToken);
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, refresh token failed' });
  }
};
