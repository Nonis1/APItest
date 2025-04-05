document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const messageDisplay = document.getElementById('message-display');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // Function to fetch messages from our local API
    // WebSocket connection
const wsUrl = window.location.protocol === 'https:' ? 
    `wss://${window.location.host}/ws` : 
    `ws://${window.location.host}/ws`;
const ws = new WebSocket(wsUrl);

ws.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    appendMessage(newMessage);
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    errorElement.classList.remove('hidden');
};

// Function to append a single message
function appendMessage(msg) {
    const messageHtml = `<div class="message-item">
        <p class="message-text">${msg.text}</p>
        <span class="message-time">${new Date(msg.timestamp).toLocaleString()}</span>
    </div>`;
    
    if (messageDisplay.innerHTML === '<p>No messages yet. Send one using Postman!</p>') {
        messageDisplay.innerHTML = messageHtml;
    } else {
        messageDisplay.insertAdjacentHTML('afterbegin', messageHtml);
    }
}

async function fetchMessages() {
        // Show loading indicator
        messageDisplay.innerHTML = '';
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');

        try {
            // Using our local API server
            // Change this line in your fetchMessages function:
            const response = await fetch('/api/messages');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const messages = await response.json();
            
            // Display the messages
            if (messages.length === 0) {
                messageDisplay.innerHTML = '<p>No messages yet. Send one using Postman!</p>';
            } else {
                const messagesHtml = messages.map(msg => {
                    return `<div class="message-item">
                        <p class="message-text">${msg.text}</p>
                        <span class="message-time">${new Date(msg.timestamp).toLocaleString()}</span>
                    </div>`;
                }).reverse().join('');
                messageDisplay.innerHTML = messagesHtml;
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            errorElement.classList.remove('hidden');
        } finally {
            // Hide loading indicator
            loadingElement.classList.add('hidden');
        }
    }

    // Fetch messages when the page loads
    fetchMessages();
});