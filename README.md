# AI Blood Sugar Chatbot (Full Stack)

A full-stack chatbot app that helps users track blood sugar readings, save chat history, and view 7-day analytics.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Chart.js
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- AI: OpenAI API (with fallback rule-based responses if API key is missing)
- Auth: JWT

## Folder Structure

```text
.
├── client
└── server
```

## Features

- ChatGPT-style layout with sidebar + main chat window
- JWT signup/login and user-specific data isolation
- Chat sessions history in sidebar
- Reload previous chats by clicking a session
- Message bubbles with timestamps
- Loading animation while AI responds
- Auto-detect blood sugar readings from chat (example: "My sugar level is 140")
- Save readings to MongoDB with date/time
- Dashboard with:
  - Average sugar level
  - Total readings
  - Last 7-day trend chart (Chart.js)
  - Recent readings list
  - Manual reading entry form
- Dark mode toggle
- Responsive layout

## Backend API Endpoints

All routes are available in two forms:
- `/api/...` (recommended)
- `/<route>` (compatibility aliases)

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Chat

- `POST /api/chat`  
  Body:
  ```json
  {
    "message": "My sugar level is 140",
    "sessionId": "optional-session-id"
  }
  ```

### Sugar

- `POST /api/sugar`
- `GET /api/sugar?limit=50`

### History

- `GET /api/history`
- `GET /api/history/:sessionId`

### Analytics

- `GET /api/analytics`

## Local Setup

## 1) Prerequisites

- Node.js 18+
- MongoDB running locally (or Atlas connection string)

## 2) Configure Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blood_sugar_chatbot
JWT_SECRET=replace-with-a-strong-secret
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Install and run backend:

```bash
npm install
npm run dev
```

## 3) Configure Frontend

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

Install and run frontend:

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

## Notes

- If `OPENAI_API_KEY` is empty, chat still works using a rule-based fallback.
- This app provides educational wellness support only and is not a medical diagnosis tool.
