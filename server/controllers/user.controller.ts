import { Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImage: updatedUser.profileImage,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
