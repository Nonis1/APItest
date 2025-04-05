const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins during development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// Parse JSON bodies
app.use(express.json());

// Your existing routes
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }
  
  const newMessage = {
    text,
    timestamp: new Date().toISOString()
  };
  
  // Send response
  res.status(201).json(newMessage);
});

module.exports = app;