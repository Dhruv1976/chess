# ♟️ Chess 

A real-time multiplayer chess application built with the MERN stack.

**Deployment Link**: https://chess1001.vercel.app/

## Features

- Real-time multiplayer chess gameplay
- Live chat with message persistence
- Responsive design for desktop and mobile
- Room-based game system
- Move validation and game state management

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Socket.io Client, react-chessboard
**Backend:** Node.js, Express, Socket.io, chess.js

## Quick Start

1. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd frontend && npm install
   ```

2. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

3. **Play:** Open `http://localhost:5173` in two browser tabs

## Project Structure

```
chess/
├── backend/          # Express + Socket.io server
├── frontend/         # React + Vite client
└── README.md
```

## Key Technologies Demonstrated

- Real-time communication with Socket.io
- React state management with Context API
- Responsive UI with Tailwind CSS
- Chess game logic with chess.js
- Full-stack JavaScript development
