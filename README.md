# 🐺 FENRIR AI

**FENRIR AI** is a full-stack AI intelligence platform that combines an AI assistant, image generation, SEO intelligence, analytics, reporting, and Google authentication in a single web application.

The project was designed to demonstrate how multiple AI-powered tools can be integrated into one practical and deployable platform.

---

## 🚀 Live Application

**Live Demo:**  
https://fenrir-e4g5jxcpy-gopinath04-rs-projects.vercel.app/

---

## 🎯 What FENRIR AI Does

FENRIR AI provides a unified workspace where users can:

- 💬 Interact with an AI assistant
- 🎨 Generate AI-powered images
- 🔍 Analyze SEO-related data
- 📊 View analytics and performance metrics
- 📄 Generate and view reports
- 🔐 Sign in securely using Google OAuth
- 💾 Maintain AI conversation history
- 🎨 Customize the application interface

---

## 👤 Who Is It For?

FENRIR AI is designed for students, developers, creators, and small teams who want multiple AI and productivity tools available from one interface instead of switching between several applications.

---

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- FastAPI
- Python
- REST APIs

### Authentication
- Google OAuth 2.0

### Deployment
- Vercel — Frontend
- Render — Backend

### Development Tools
- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Architecture

FENRIR AI follows a frontend-backend architecture:

```text
User
  │
  ▼
React + Vite Frontend
  │
  │ HTTPS / API Requests
  ▼
FastAPI Backend
  │
  ├── AI Assistant
  ├── Image Generation
  ├── SEO Intelligence
  ├── Analytics
  └── Reports
  │
  ▼
External AI / Data Services
```

Google OAuth is used separately to authenticate users before they access the platform.

---

## ⚙️ How It Works

1. The user opens the deployed FENRIR AI application.
2. The user signs in using Google authentication.
3. The React frontend displays the main dashboard and available tools.
4. When a user performs an AI operation, the frontend sends an API request to the FastAPI backend.
5. The backend processes the request and communicates with the required AI or data service.
6. The result is returned to the frontend.
7. React displays the response to the user.

---

## 📁 Main Features

### 🤖 Fenrir Assistant

The AI assistant allows users to enter prompts and receive AI-generated responses through a conversational interface.

The application also provides conversation management features for maintaining previous chats.

### 🎨 Image Studio

Image Studio provides an interface for generating images using AI from user prompts.

### 🔎 SEO Intelligence

SEO Intelligence allows SEO-related data to be processed and analyzed to provide useful insights.

### 📊 Analytics

The Analytics section presents application or data metrics in a structured visual interface.

### 📄 Reports

The Reports module organizes insights and results into a readable reporting interface.

### 🔐 Google Authentication

Google OAuth 2.0 provides secure user authentication without requiring FENRIR AI to directly manage user passwords.

---

## 🔄 Example Data Flow

For an AI Assistant request:

```text
User enters a prompt
        ↓
React frontend receives the input
        ↓
Frontend sends API request
        ↓
FastAPI backend receives request
        ↓
AI service processes the prompt
        ↓
Backend receives AI response
        ↓
Response is returned to React
        ↓
Answer appears in the chat interface
```

---

## 🧪 Evaluation and Testing

The application was tested using real end-to-end workflows.

### Test 1 — Authentication
**Input:** User selects Google Sign-In  
**Expected:** User authenticates and enters the application  
**Result:** Passed

### Test 2 — AI Assistant
**Input:** User submits a text prompt  
**Expected:** Backend processes the request and returns an AI response  
**Result:** Passed

### Test 3 — Conversation Interface
**Input:** User starts and manages conversations  
**Expected:** Conversation interface updates correctly  
**Result:** Passed

### Test 4 — Production API Connection
**Input:** Vercel frontend sends a request to the deployed FastAPI backend  
**Expected:** Backend accepts the request and returns a response  
**Result:** Passed after configuring production CORS

### Test 5 — Mobile Portfolio
**Input:** Portfolio opened on a real mobile device  
**Expected:** Responsive layout, readable content and working navigation  
**Result:** Passed

---

## 🧠 Important Design Decision

One important design decision was separating the frontend and backend.

The React frontend is deployed on Vercel while the FastAPI backend is deployed separately on Render.

This keeps the user interface independent from backend processing and makes the architecture easier to maintain and extend.

During deployment, this architecture also required proper **CORS configuration** because the frontend and backend operate from different origins.

---

## 🐛 Problem Solved During Deployment

During production testing, the AI Assistant initially returned a network error even though the backend was healthy.

Browser developer tools showed that the request was being blocked by the browser's Cross-Origin Resource Sharing (CORS) policy.

The FastAPI backend was updated using `CORSMiddleware` to explicitly allow the production Vercel origin.

After redeployment, communication between the frontend and backend worked correctly.

This demonstrated an important difference between a feature working locally and working in a real production environment.

---

## ⚠️ Current Limitations

FENRIR AI is currently a prototype and has several limitations:

- Some AI features depend on external APIs and their availability.
- Response speed can depend on backend hosting and external services.
- Free-tier cloud hosting may introduce startup delays.
- Analytics and SEO functionality can be expanded with more real-world data integrations.
- The platform requires an internet connection for cloud-based AI functionality.

These are known limitations and possible areas for future development.

---

## 🔮 Future Improvements

Future versions of FENRIR AI could include:

- Real-time analytics integrations
- More advanced SEO analysis
- Additional AI models
- Improved persistent user data
- Expanded report generation
- Better mobile optimization
- Faster backend infrastructure
- More AI automation tools

---

## 💻 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gopinath04-R/FENRIR-AI.git
cd FENRIR-AI
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

### 4. Install Backend Dependencies

Navigate to the backend directory and run:

```bash
pip install -r requirements.txt
```

### 5. Start FastAPI

```bash
uvicorn main:app --reload
```

The exact environment variables required depend on the external services configured for the project.

> API keys, OAuth secrets, and other private credentials should never be committed to the repository.

---

## 🔒 Security

FENRIR AI follows basic production security practices:

- Sensitive API credentials are stored using environment variables.
- Google OAuth is used for authentication.
- Backend CORS rules control allowed frontend origins.
- Secrets are not intended to be stored directly in public source code.

---

## 👨‍💻 Developer

**Gopinath R**  
Computer Science and Engineering Student

GitHub:  
https://github.com/gopinath04-R

---

## 📌 Project Status

**Deployed Prototype — Active Development**

FENRIR AI demonstrates the complete workflow from designing an AI product to building the frontend and backend, integrating external services, debugging production issues, and deploying the final application.