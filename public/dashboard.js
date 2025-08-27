const API_BASE_URL = 'https://nodejs-learning-app-nadb.onrender.com';

// This function runs as soon as the page loads
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Get the token from localStorage
  const token = localStorage.getItem("token");

  // 2. If no token, redirect to login page
  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  // 3. If token exists, fetch the protected data
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/data`, {
      method: "GET",
      headers: {
                'x-auth-token': token // Send the token in the header
            }
    });

    if (!response.ok) {
      // If token is invalid (e.g., expired), redirect to login
      localStorage.removeItem("token");
      window.location.href = "/index.html";
      return;
    }

    const data = await response.json();

    // Display a personalized welcome message
    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.textContent = `Welcome, User! Let's start learning.`; // A friendlier message
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    window.location.href = "/index.html"; // Redirect on error
  }
});

// --- THIS IS THE NEW PART ---

// Get all the topic buttons and the content area
const topicButtons = document.querySelectorAll(".topic-btn");
const contentArea = document.getElementById("content-area");

// Add a click listener to each button
topicButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const topic = button.textContent;
    const token = localStorage.getItem("token");

    // Show a loading message
    contentArea.innerHTML = "<p>Generating content, please wait...</p>";

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/generate`, {
        method: "POST",
        headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!response.ok) {
        contentArea.innerHTML =
          "<p>Error generating content. Please try again.</p>";
        return;
      }

      const data = await response.json();
      // Display the AI-generated content
      contentArea.innerHTML = data.content.replace(/\n/g, "<br>"); // Format the text a little
    } catch (error) {
      console.error("Error:", error);
      contentArea.innerHTML = "<p>There was an error fetching the content.</p>";
    }
  });
});

// --- THIS IS THE NEW LOGOUT PART ---

// Get the logout button
const logoutButton = document.getElementById("logout-btn");

// Add a click listener to the logout button
logoutButton.addEventListener("click", () => {
  // Remove the token from localStorage
  localStorage.removeItem("token");

  // Redirect the user to the login page
  window.location.href = "/index.html";
});
