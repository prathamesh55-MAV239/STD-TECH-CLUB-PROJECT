/**
 * Student Tech Hub - Frontend Logic (JavaScript)
 * 
 * This file manages user interactions, communicates with the FastAPI backend
 * using the modern Fetch API, and dynamically updates the HTML DOM.
 */

// 1. Configuration: Base URL for our FastAPI backend
const API_BASE_URL = "http://127.0.0.1:8000";

// 2. Select key DOM elements from index.html
const loadEventsBtn = document.getElementById("load-events-btn");
const eventsContainer = document.getElementById("events-container");
const eventsStatus = document.getElementById("events-status");

const registrationForm = document.getElementById("registration-form");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const registerBtn = document.getElementById("register-btn");
const registrationStatus = document.getElementById("registration-status");

/**
 * Helper function to show formatted status messages (loading, success, error)
 * @param {HTMLElement} element - The container element to display the message in
 * @param {string} text - Message text to display
 * @param {"loading" | "success" | "error" | ""} type - Status style type
 */
function setStatus(element, text, type = "") {
  element.className = "status-message " + type;
  element.textContent = text;
}

/**
 * Helper function to safely escape text to prevent HTML injection
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================================================
// FEATURE 1: Load and Render Upcoming Technical Events
// ==========================================================================

/**
 * Fetches events from the backend GET /api/events endpoint and displays them.
 */
async function loadEvents() {
  // Show a loading indicator and disable button while fetching
  setStatus(eventsStatus, "⏳ Fetching upcoming events from backend...", "loading");
  loadEventsBtn.disabled = true;

  try {
    // Send an HTTP GET request to our FastAPI server
    const response = await fetch(`${API_BASE_URL}/api/events`);

    // Check if the server responded with an error HTTP status (e.g. 500)
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    // Parse the JSON array from the response body
    const events = await response.json();

    // Check if any events were returned
    if (!events || events.length === 0) {
      setStatus(eventsStatus, "No upcoming events found at the moment.", "loading");
      eventsContainer.innerHTML = "";
      return;
    }

    // Clear the loading message
    setStatus(eventsStatus, "");

    // Clear existing placeholder/cards and render new cards
    eventsContainer.innerHTML = "";

    events.forEach((event) => {
      // Create a card element for each event
      const card = document.createElement("article");
      card.className = "event-card";

      card.innerHTML = `
        <div class="event-card-header">
          <span class="event-tag">Event #${escapeHTML(String(event.id))}</span>
          <h3 class="event-title">${escapeHTML(event.title)}</h3>
        </div>
        <div class="event-meta">
          <div class="event-meta-item">
            <span>📅</span>
            <strong>${escapeHTML(event.date)}</strong>
          </div>
          <div class="event-meta-item">
            <span>📍</span>
            <span>${escapeHTML(event.location)}</span>
          </div>
        </div>
        <p class="event-description">${escapeHTML(event.description)}</p>
      `;

      eventsContainer.appendChild(card);
    });

  } catch (error) {
    // Friendly error message if backend is offline or network fails
    console.error("Error loading events:", error);
    setStatus(
      eventsStatus,
      `⚠️ Could not reach the backend server at ${API_BASE_URL}. Please ensure your FastAPI backend is running!`,
      "error"
    );
  } finally {
    // Re-enable the load button
    loadEventsBtn.disabled = false;
  }
}

// Attach click event listener to the "Load Events" button
loadEventsBtn.addEventListener("click", loadEvents);


// ==========================================================================
// FEATURE 2: Register Student Form Submission
// ==========================================================================

/**
 * Handles the registration form submit event.
 * @param {Event} e 
 */
async function handleRegistration(e) {
  // Prevent default browser form submission (which reloads the whole page)
  e.preventDefault();

  // Clear any existing messages
  setStatus(registrationStatus, "");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Client-side quick check
  if (!name || !email) {
    setStatus(registrationStatus, "⚠️ Please fill in both your name and email address.", "error");
    return;
  }

  // Basic email pattern check before sending
  if (!emailInput.checkValidity()) {
    setStatus(registrationStatus, "⚠️ Please enter a valid email address.", "error");
    return;
  }

  // Show loading status and disable button
  setStatus(registrationStatus, "Submitting your registration...", "loading");
  registerBtn.disabled = true;

  try {
    // Send HTTP POST request with JSON payload to FastAPI
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // If the backend returned a validation error message
      const errorMsg = data.detail || "Registration failed. Please check your information.";
      setStatus(registrationStatus, `⚠️ ${errorMsg}`, "error");
      return;
    }

    // Success! Show confirmation message with student details returned by server
    setStatus(
      registrationStatus,
      `🎉 ${data.message}! Welcome, ${data.name} (${data.email}). We've sent a welcome packet to your inbox.`,
      "success"
    );

    // Reset the input fields
    registrationForm.reset();

  } catch (error) {
    // Friendly error message when server cannot be reached
    console.error("Error submitting registration:", error);
    setStatus(
      registrationStatus,
      `⚠️ Unable to connect to the backend server at ${API_BASE_URL}. Please check that FastAPI is running.`,
      "error"
    );
  } finally {
    // Re-enable the submit button
    registerBtn.disabled = false;
  }
}

// Attach submit event listener to the registration form
registrationForm.addEventListener("submit", handleRegistration);
