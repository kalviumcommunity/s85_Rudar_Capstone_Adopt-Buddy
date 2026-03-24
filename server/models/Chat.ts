import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';

export interface IMessage {
  sender: mongoose.Types.ObjectId | IUser | string;
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  participants: (mongoose.Types.ObjectId | IUser | string)[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', chatSchema);
