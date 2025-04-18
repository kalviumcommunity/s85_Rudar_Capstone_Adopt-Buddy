const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }, 
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'  
  },
  message: { type: String }, 
  requestedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
