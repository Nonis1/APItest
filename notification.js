// notification.js - Frontend script for SAP notification creation

const authHeader = 'Basic ' + btoa('admin:password123');
const messageElement = document.getElementById('message');

// Function to show message (success/error)
function showMessage(text, isError = false) {
    messageElement.textContent = text;
    messageElement.className = `message ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
        messageElement.className = 'message hidden';
    }, 5000);
}

// Function to fetch and populate dropdown options
async function fetchDropdownData(endpoint, selectElement) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            headers: { 'Authorization': authHeader }
        });
        
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        
        const data = await response.json();
        selectElement.innerHTML = `<option value="">Select ${endpoint}...</option>`;
        
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.id} - ${item.description}`;
            selectElement.appendChild(option);
        });
    } catch (error) {
        showMessage(`Error loading ${endpoint}: ${error.message}`, true);
    }
}

// Function to submit notification
async function submitNotification(event) {
    event.preventDefault();
    
    const formData = {
        equipment: document.getElementById('equipment').value,
        funcLoc: document.getElementById('funcLoc').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create notification');

        const result = await response.json();
        showMessage('Notification created successfully!');
        document.getElementById('notificationForm').reset();
    } catch (error) {
        showMessage(`Error creating notification: ${error.message}`, true);
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    // Fetch dropdown data
    fetchDropdownData('equipment', document.getElementById('equipment'));
    fetchDropdownData('functional-locations', document.getElementById('funcLoc'));

    // Add form submit handler
    document.getElementById('notificationForm')
        .addEventListener('submit', submitNotification);
});