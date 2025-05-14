const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  species: { type: String, required: true },  
  breed: { type: String, required: true },
  gender: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },

  // Relationship: shelter is a reference to a User document (the shelter who posted the pet)
  shelter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  

  isAdopted: { type: Boolean, default: false },
  postedAt: { type: Date, default: Date.now }
});

// Exporting the Pet model
module.exports = mongoose.model('Pet', petSchema);
