const mongoose = require('mongoose');

const specimenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Common name is required'],
    trim: true,
  },
  scientificName: {
    type: String,
    trim: true,
  },
  careLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  waterFrequency: {
    type: Number, // in days
    required: [true, 'Watering frequency is required'],
  },
  sunlight: {
    type: String,
    enum: ['Low', 'Partial', 'Bright Indirect', 'Full'],
    default: 'Bright Indirect',
  },
  notes: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Specimen', specimenSchema);
