import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';

export interface IPet extends Document {
  name: string;
  age: number;
  species: string;
  breed: string;
  gender: 'male' | 'female';
  description: string;
  image: string;
  shelter: mongoose.Types.ObjectId | IUser | string;
  isAdopted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    species: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    shelter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isAdopted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPet>('Pet', petSchema);
