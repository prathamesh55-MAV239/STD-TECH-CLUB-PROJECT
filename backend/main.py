"""
Student Tech Hub - Backend API
A beginner-friendly REST API built with Python, FastAPI, and Pydantic.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------------------------------------------------------------
# 1. FastAPI Application Initialization
# -----------------------------------------------------------------------------
app = FastAPI(
    title="Student Tech Hub API",
    description="A simple API serving technical campus events and student registrations.",
    version="1.0.0"
)

# -----------------------------------------------------------------------------
# 2. CORS (Cross-Origin Resource Sharing) Middleware Setup
# -----------------------------------------------------------------------------
# Why is CORS needed?
# By default, browsers prevent a frontend web page (e.g. running on port 5500)
# from making HTTP requests to a backend server running on another origin or port
# (e.g. port 8000). Enabling CORSMiddleware allows our frontend to communicate
# seamlessly with this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allows requests from any origin (ideal for local testing)
    allow_credentials=True,     # Allows cookies and credentials (if needed)
    allow_methods=["*"],        # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # Allows all HTTP request headers
)

# -----------------------------------------------------------------------------
# 3. Data Models (Pydantic)
# -----------------------------------------------------------------------------
# Pydantic models automatically validate incoming JSON request bodies.
# If a client sends missing fields or invalid types, FastAPI automatically
# responds with a helpful 422 error.
class RegistrationRequest(BaseModel):
    name: str
    email: str

# -----------------------------------------------------------------------------
# 4. In-Memory Sample Data & Temporary Storage
# -----------------------------------------------------------------------------
# We store sample technical events as a simple Python list of dictionaries.
# No database required!
SAMPLE_EVENTS = [
    {
        "id": 1,
        "title": "Introduction to Modern Web Development",
        "date": "October 15, 2026",
        "location": "Engineering Hall - Room 101",
        "description": "Learn the foundations of HTML5, responsive CSS Flexbox/Grid, and modern JavaScript."
    },
    {
        "id": 2,
        "title": "Building Fast APIs with Python & FastAPI",
        "date": "October 22, 2026",
        "location": "Computer Lab 3 & Live Stream",
        "description": "Hands-on workshop creating high-performance REST APIs, route handlers, and Pydantic validation."
    },
    {
        "id": 3,
        "title": "Generative AI & Machine Learning Primer",
        "date": "November 05, 2026",
        "location": "Campus Innovation Center",
        "description": "Understand core AI concepts, prompt engineering, and how to integrate LLM capabilities into apps."
    },
    {
        "id": 4,
        "title": "Annual Campus Open Source Hackathon",
        "date": "November 19, 2026",
        "location": "Student Activity Center",
        "description": "Join teams for a 24-hour coding challenge building community tools and contributing to open source."
    },
    {
        "id": 5,
        "title": "Mastering Git, GitHub & Team Collaboration",
        "date": "December 03, 2026",
        "location": "Virtual Session (Zoom)",
        "description": "Step-by-step guidance on branches, pull requests, resolving merge conflicts, and team workflows."
    }
]

# Temporary in-memory list to track registrations during the server session
registrations_db = []


# -----------------------------------------------------------------------------
# 5. API Endpoints (Route Handlers)
# -----------------------------------------------------------------------------

@app.get("/")
def read_root():
    """
    Root endpoint: Provides a friendly welcome message and links to API documentation.
    """
    return {
        "message": "Welcome to the Student Tech Hub API!",
        "docs_url": "http://127.0.0.1:8000/docs",
        "events_url": "http://127.0.0.1:8000/api/events"
    }


@app.get("/api/events")
def get_events():
    """
    GET /api/events
    Returns a list of upcoming technical events as JSON.
    """
    return SAMPLE_EVENTS


@app.post("/api/register")
def register_student(student: RegistrationRequest):
    """
    POST /api/register
    Accepts student's name and email in JSON format, validates them,
    stores them temporarily in memory, and returns a confirmation JSON response.
    """
    cleaned_name = student.name.strip()
    cleaned_email = student.email.strip()

    # Basic server-side validation to ensure non-empty input
    if not cleaned_name or not cleaned_email:
        raise HTTPException(
            status_code=400,
            detail="Name and email cannot be empty."
        )

    # Basic email sanity check (ensures an '@' symbol is present)
    if "@" not in cleaned_email:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid email address with an '@' symbol."
        )

    # Store registration in memory
    record = {
        "name": cleaned_name,
        "email": cleaned_email
    }
    registrations_db.append(record)

    # Print to the backend console so you can see live activity in your terminal
    print(f"[New Registration] Name: '{cleaned_name}', Email: '{cleaned_email}'")

    # Return confirmation JSON matching the requested structure
    return {
        "message": "Registration successful",
        "name": cleaned_name,
        "email": cleaned_email
    }
