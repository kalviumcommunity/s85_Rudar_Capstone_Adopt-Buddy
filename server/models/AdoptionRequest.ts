import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';
import { IPet } from './Pet.js';

export interface IAdoptionRequest extends Document {
  adopter: mongoose.Types.ObjectId | IUser | string;
  pet: mongoose.Types.ObjectId | IPet | string;
  shelter: mongoose.Types.ObjectId | IUser | string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const adoptionRequestSchema = new Schema<IAdoptionRequest>(
  {
    adopter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    shelter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAdoptionRequest>('AdoptionRequest', adoptionRequestSchema);
