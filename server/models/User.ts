import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  role: 'adopter' | 'shelter';
  profileImage?: string;
  bio?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['adopter', 'shelter'], required: true },
    profileImage: { type: String, default: 'https://picsum.photos/seed/user/200/200' },
    bio: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
