import { Response } from 'express';
import Chat from '../models/Chat.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({ participants: req.user?.id })
      .populate('participants', 'firstName lastName username profileImage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id).populate(
      'participants',
      'firstName lastName username profileImage'
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      (p: any) => p._id.toString() === req.user?.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createOrGetChat = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body; // The other user's ID

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if chat already exists between these two users
    let chat = await Chat.findOne({
      participants: { $all: [req.user?.id, userId] },
    }).populate('participants', 'firstName lastName username profileImage');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user?.id, userId],
        messages: [],
      });
      chat = await chat.populate('participants', 'firstName lastName username profileImage');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user?.id
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send message to this chat' });
    }

    const newMessage = {
      sender: req.user?.id as any,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(chatId).emit('receive_message', {
      chatId,
      message: newMessage,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
