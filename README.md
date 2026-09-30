# Student Tech Hub 🎓

Welcome to **Student Tech Hub**! This is a simple, beginner-friendly full-stack web application designed to demonstrate how a modern web frontend communicates with a Python backend.

---

## 📖 What This Project Does

The application allows students to:
1. **Browse Upcoming Technical Events:** View hands-on workshops, tech talks, and hackathons presented as responsive cards.
2. **Fetch Live Events On-Demand:** Clicking the **"Load Events"** button sends an HTTP `GET` request from the browser to the backend server and dynamically updates the page.
3. **Register for the Hub:** Students can enter their name and email into a clean registration form. When submitted, the frontend sends an HTTP `POST` request to the backend with their details, validates the input, and displays a friendly success confirmation directly on the page.

---

## 📁 Project Structure

```text
student-tech-hub/
├── frontend/
│   ├── index.html       # Semantic HTML layout and structure
│   ├── style.css        # Responsive styling with Flexbox and Grid
│   └── script.js        # Modern JavaScript (Fetch API & DOM updates)
├── backend/
│   ├── main.py          # FastAPI application, CORS setup, and endpoints
│   └── requirements.txt # Python dependencies (fastapi and uvicorn)
└── README.md            # Step-by-step setup and learning guide
```

---

## 🛠️ Step 1: Install & Set Up the Backend

The backend is built with **Python**, **FastAPI**, and **Uvicorn**.

### 1. Open your terminal and navigate to the `backend` folder:

On Windows (Command Prompt or PowerShell):
```bash
cd backend
```

On macOS / Linux:
```bash
cd backend
```

### 2. Create a Python Virtual Environment:
A virtual environment keeps your project dependencies isolated from other Python projects.

**Windows:**
```bash
python -m venv venv
```

**macOS / Linux:**
```bash
python3 -m venv venv
```

### 3. Activate the Virtual Environment:

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```
*(If you see an execution policy error on PowerShell, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and try again, or use Command Prompt: `.\venv\Scripts\activate.bat`)*

**macOS / Linux:**
```bash
source venv/bin/activate
```

When activated, you will see `(venv)` at the beginning of your terminal prompt.

### 4. Install the Dependencies:
Install FastAPI and Uvicorn from `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## 🚀 Step 2: Run the Backend Server

Start the FastAPI application using the `uvicorn` development server with auto-reload enabled:

```bash
uvicorn main:app --reload
```

### Where to view your API:
* **Base API Address:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* **Events Endpoint (JSON):** [http://127.0.0.1:8000/api/events](http://127.0.0.1:8000/api/events)
* **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

FastAPI automatically generates interactive Swagger documentation at `/docs`. You can open this URL in any browser to test your endpoints without even writing frontend code!

---

## 💻 Step 3: Run the Frontend Locally

You have two easy ways to run the frontend:

### Option A: Open `index.html` directly in your browser
1. Navigate to the `frontend` folder on your computer.
2. Double-click `index.html` (or right-click and choose **Open with > Google Chrome / Microsoft Edge / Firefox**).

### Option B: Use a local development server (Recommended)
Running a local web server mimics real-world web hosting:

* **Using VS Code Live Server Extension:**
  1. Open the project in VS Code.
  2. Right-click `frontend/index.html` and click **"Open with Live Server"**.
  3. Your browser will open at `http://127.0.0.1:5500`.

* **Using Python's built-in HTTP server:**
  Open a **new** terminal window (keep the backend terminal running), navigate to `frontend`, and run:
  ```bash
  cd frontend
  python -m http.server 3000
  ```
  Then visit [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

---

## 🔄 How the Frontend Communicates with the Backend

Here is how data flows between your browser (frontend) and your server (backend):

```text
  [ Frontend: Browser ]                           [ Backend: FastAPI (port 8000) ]
        │                                                         │
        │ ── GET http://127.0.0.1:8000/api/events ─────────────>  │ (Fetches events list)
        │ <─ Returns JSON: [{"id": 1, "title": "..."}, ...] ────  │
        │                                                         │
        │ ── POST http://127.0.0.1:8000/api/register ──────────>  │ (Sends name & email)
        │    Payload: {"name": "Alex", "email": "alex@uni.edu"}   │ (Validates via Pydantic)
        │ <─ Returns JSON: {"message": "Registration successful"} │
```

### 1. The JavaScript Fetch API
The frontend uses the built-in browser `fetch()` function to send HTTP requests asynchronously without reloading the page.
* When you click **"Load Events"**, `fetch('http://127.0.0.1:8000/api/events')` is called. Once the server answers, the response is parsed from JSON into JavaScript objects and dynamically rendered as event cards.
* When you submit the **Registration Form**, `fetch('http://127.0.0.1:8000/api/register', { method: 'POST', ... })` transmits the student's name and email as a JSON string inside the request body.

### 2. JSON (JavaScript Object Notation)
JSON is the universal language of modern web APIs. Both FastAPI and JavaScript understand JSON natively:
* The backend returns data using Python dictionaries, which FastAPI automatically serializes into JSON text.
* The frontend consumes this JSON with `await response.json()`.

### 3. The Two Backend Endpoints
1. `GET /api/events`:
   * **Purpose:** Retrieves a list of upcoming technical events.
   * **Method:** `GET` (used for retrieving data without changing server state).
   * **Response:** A JSON list containing 5 sample events with title, date, location, and description.
2. `POST /api/register`:
   * **Purpose:** Registers a new student for the hub.
   * **Method:** `POST` (used for sending data to the server to process).
   * **Validation:** FastAPI validates the payload against the Pydantic `RegistrationRequest` model.
   * **Response:** A confirmation JSON object confirming the registration.

### 4. Why CORS is Needed (Cross-Origin Resource Sharing)
* **What is an "Origin"?** An origin is defined by the protocol (`http`), domain (`127.0.0.1`), and port (e.g. `5500` or `3000`).
* **The Problem:** Web browsers have a built-in security mechanism called the **Same-Origin Policy**. If your frontend runs at `http://127.0.0.1:5500` and attempts to fetch data from `http://127.0.0.1:8000`, the browser treats them as two different origins and blocks the request by default.
* **The Solution:** In `backend/main.py`, we add FastAPI's `CORSMiddleware`. This tells the server to attach special HTTP headers (`Access-Control-Allow-Origin: *`) to all responses. When the browser sees these headers, it safely allows your frontend script to access the data.

---

## 🎯 Verification Checklist

To verify everything works end-to-end:
1. Start the backend: `uvicorn main:app --reload` inside the `backend` folder.
2. Open `http://127.0.0.1:8000/api/events` in your browser to verify the JSON data.
3. Open `http://127.0.0.1:8000/docs` to see the interactive FastAPI docs.
4. Open `frontend/index.html` in your browser.
5. Click **"Load Events"** and watch the event cards appear smoothly on the screen.
6. Enter a name and email into the registration form, click **"Register Now"**, and check both the success alert on the screen and the printed message in your backend terminal!
