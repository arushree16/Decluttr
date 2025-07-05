const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line
console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema and model for user data
const userSchema = new mongoose.Schema({
  userId: String, // can be Firebase UID or a generated ID for guests
  thoughtHistory: Array,
  suggestionHistory: Array,
  moodHistory: Array,
  tasks: Array,
});
const User = mongoose.model('User', userSchema);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Decluttr backend is running!' });
});

// Get user data
app.get('/api/user/:userId', async (req, res) => {
  console.log('GET request for user:', req.params.userId);
  try {
    const user = await User.findOne({ userId: req.params.userId });
    console.log('Found user data:', user);
    res.json(user || {});
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Save/update user data
app.post('/api/user/:userId', async (req, res) => {
  console.log('POST request for user:', req.params.userId);
  console.log('Saving user data:', req.body);
  try {
    const { thoughtHistory, suggestionHistory, moodHistory, tasks } = req.body;
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { thoughtHistory, suggestionHistory, moodHistory, tasks },
      { upsert: true, new: true }
    );
    console.log('Saved user data successfully:', user);
    res.json(user);
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
