const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Create HTTP server
const server = require('http').createServer(app);

// Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Enable CORS for your frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// In-memory storage for messages
const messages = [];

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

  // Broadcast the new message to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(newMessage));
    }
  });

  res.status(201).json(newMessage);
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});