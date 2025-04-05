// app.js - Complete frontend script for message polling

const apiUrl = '/api/messages'; // Relative API URL
const authHeader = 'Basic ' + btoa('admin:password123'); // Auth credentials

// Function to fetch and display the latest message
function fetchLatestMessage() {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': authHeader
    }
  })
    .then(res => res.ok ? res.json() : Promise.reject('No messages yet'))
    .then(data => {
      document.getElementById('messages').textContent =
        `${data.text} — ${new Date(data.timestamp).toLocaleTimeString()}`;
    })
    .catch(() => {
      document.getElementById('messages').textContent = '(No messages yet)';
    });
}

// Function to submit a new message
function submitMessage(event) {
  event.preventDefault(); // Prevent form from refreshing page

  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({ text: message })
  })
    .then(res => res.json())
    .then(() => {
      messageInput.value = '';
      fetchLatestMessage(); // Refresh immediately
    });
}

// Attach event listener to the form
const form = document.getElementById('messageForm');
form.addEventListener('submit', submitMessage);

// Start polling every 3 seconds
setInterval(fetchLatestMessage, 3000);

// Initial load
fetchLatestMessage();