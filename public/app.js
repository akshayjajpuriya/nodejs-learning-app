// Get the form elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const API_BASE_URL = 'https://nodejs-learning-app-nadb.onrender.com';


// --- SIGNUP FORM EVENT LISTENER ---
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Send the data to the server
    const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    const result = await response.json();

    if (response.ok) {
        alert('Signup successful! Please log in.');
        signupForm.reset(); // Clear the form
    } else {
        alert(`Error: ${result.message}`);
    }
});

// --- LOGIN FORM EVENT LISTENER ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the form data
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Send the data to the server
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        // Save the token and redirect
        localStorage.setItem('token', result.token);
        window.location.href = '/dashboard.html'; // Go to the dashboard
    } else {
        alert(`Error: ${result.message}`);
    }
});