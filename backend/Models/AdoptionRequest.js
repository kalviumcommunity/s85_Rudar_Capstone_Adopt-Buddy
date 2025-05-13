const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  // Relationship: adopter is a reference to a User document
  adopter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  // Relationship: pet is a reference to a Pet document
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: true 
  }, 
  // Relationship: shelter is also a reference to a User document (with role 'shelter')
  shelter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending'  
  },
  message: { type: String }, 
  requestedAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
