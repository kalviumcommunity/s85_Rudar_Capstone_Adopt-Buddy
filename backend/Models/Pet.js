const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  species: { type: String, required: true },  
  breed: { type: String, required: true },
  gender: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  isAdopted: { type: Boolean, default: false },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', petSchema);
