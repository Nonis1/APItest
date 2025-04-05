const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// In-memory storage for messages (note: this will reset on each deployment)
let messages = [];

// GET endpoint to retrieve messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// POST endpoint to add a new message
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }
  
  const newMessage = {
    text,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Export the Express API
module.exports = app;