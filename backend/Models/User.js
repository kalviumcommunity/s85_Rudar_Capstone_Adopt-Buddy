const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Role determines if the user is an adopter or a shelter
  // This is important for relationships in other models
  role: { type: String, enum: ['adopter', 'shelter'], required: true },

  phone: String,
  address: String,
  bio: String,
  profileImage: String,

  // Users are related to Pets (as shelters), AdoptionRequests (as adopters and shelters), and Shelters (as staffMembers)
  // These relationships are implemented in those respective schemas using this model's ObjectId

  createdAt: { type: Date, default: Date.now }
});

// Exporting the User model
module.exports = mongoose.model('User', userSchema);
