const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
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

// Get user data
app.get('/api/user/:userId', async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  res.json(user || {});
});

// Save/update user data
app.post('/api/user/:userId', async (req, res) => {
  console.log('Saving user data:', req.params.userId, req.body); // <-- Add this
  const { thoughtHistory, suggestionHistory, moodHistory, tasks } = req.body;
  const user = await User.findOneAndUpdate(
    { userId: req.params.userId },
    { thoughtHistory, suggestionHistory, moodHistory, tasks },
    { upsert: true, new: true }
  );
  res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
