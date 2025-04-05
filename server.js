const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS with more specific configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://apitest.vercel.app', 'http://localhost:3000'] 
    : '*',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Basic authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // For basic auth, header should be: 'Basic base64(username:password)'
  if (authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check if credentials match expected values
    if (username === 'user' && password === 'pass') {
      next();
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ error: 'Invalid authentication method' });
  }
};

// Apply authentication middleware to all routes
app.use(authenticate);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;