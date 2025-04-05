const express = require('express');
const cors = require('cors');
const app = express();

let lastMessage = null; // 👈 Store latest message in memory

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const authenticate = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Invalid or missing Authorization header' });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === 'admin' && password === 'password123') {
    return next();
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

app.use(authenticate);

// ✅ POST to save message
app.post('/api/messages', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const responseMessage = `I got it: ${text}`; // 👈 add this line

  lastMessage = {
    text: responseMessage,
    timestamp: new Date().toISOString()
  };

  res.status(201).json(lastMessage); // 👈 response includes formatted text
});


// ✅ GET latest message
app.get('/api/messages', (req, res) => {
  if (lastMessage) {
    res.json(lastMessage);
  } else {
    res.status(404).json({ error: 'No messages yet' });
  }
});

// Export the Express app for Vercel
module.exports = app;
