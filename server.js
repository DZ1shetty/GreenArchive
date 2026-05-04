require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const Specimen = require('./models/Specimen');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/flora-archive';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB: ' + mongoURI))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// API Routes

// GET all specimens
app.get('/api/specimens', async (req, res) => {
  try {
    const specimens = await Specimen.find().sort({ createdAt: -1 });
    res.status(200).json(specimens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch specimens', details: err.message });
  }
});

// GET single specimen
app.get('/api/specimens/:id', async (req, res) => {
  try {
    const specimen = await Specimen.findById(req.params.id);
    if (!specimen) return res.status(404).json({ error: 'Specimen not found' });
    res.status(200).json(specimen);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching specimen', details: err.message });
  }
});

// POST Create specimen
app.post('/api/specimens', async (req, res) => {
  try {
    const newSpecimen = new Specimen(req.body);
    const savedSpecimen = await newSpecimen.save();
    res.status(201).json(savedSpecimen);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create specimen', details: err.message });
  }
});

// PUT Update specimen
app.put('/api/specimens/:id', async (req, res) => {
  try {
    const updatedSpecimen = await Specimen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSpecimen) return res.status(404).json({ error: 'Specimen not found' });
    res.status(200).json(updatedSpecimen);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update specimen', details: err.message });
  }
});

// DELETE specimen
app.delete('/api/specimens/:id', async (req, res) => {
  try {
    const deletedSpecimen = await Specimen.findByIdAndDelete(req.params.id);
    if (!deletedSpecimen) return res.status(404).json({ error: 'Specimen not found' });
    res.status(200).json({ message: 'Specimen deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete specimen', details: err.message });
  }
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
