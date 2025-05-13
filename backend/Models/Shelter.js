const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  address: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  description: { type: String },
  website: { type: String },
  shelterImage: { type: String },  

  // Relationship: Array of references to User documents representing staff members
  staffMembers: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],

  // Relationship: Array of references to Pet documents representing available pets
  petsAvailable: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Exporting the Shelter model
module.exports = mongoose.model('Shelter', shelterSchema);
