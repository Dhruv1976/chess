# ♟️ Real-Time Multiplayer Chess

A full-featured online multiplayer chess game with real-time gameplay, persistent chat, and responsive design. Built with modern web technologies for smooth performance and seamless user experience.

## ✨ Features

- **Real-Time Multiplayer Chess** - Play chess against another player with instant move updates
- **Live Chat** - Communicate with your opponent during the game with message persistence
- **Unread Message Notifications** - Blinking indicator shows when opponent sends a message
- **Game Status Display** - View turn indicator, check highlighting, and game results
- **Room-Based Architecture** - Create and join game rooms with unique identifiers
- **Move Validation** - Server-side validation ensures only legal moves are accepted
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Game Result Display** - Clear indication of wins, losses, and draws

## 🛠️ Tech Stack

### Frontend
- **React js** - Component-based UI with hooks
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Socket.io Client** - Real-time bidirectional communication
- **react-chessboard** - Chess board UI component
- **chess.js** - Chess game logic and move validation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework for routing and middleware
- **Socket.io** - Real-time event-driven communication
- **chess.js** - Game logic and move validation
- **dotenv** - Environment variable management

## 📁 Project Structure

```
chess/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── index.js           # Server entry point
│   │   ├── app.js             # Express app configuration
│   │   ├── socketManager.js   # Socket.io initialization
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── sockets/           # Socket event handlers
│   ├── package.json
│   └── .gitignore
│
├── frontend/                   # React + Vite client
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Main app component
│   │   ├── components/        # Reusable components
│   │   │   ├── chess/         # Chess board & game info
│   │   │   ├── chat/          # Chat UI & logic
│   │   │   ├── layout/        # Layout components
│   │   │   ├── navbar/        # Navigation bar
│   │   │   └── ui/            # UI elements (buttons, loaders)
│   │   ├── context/           # React context for state
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API & game services
│   │   └── utils/             # Helper functions
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── README.md                   # This file
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chess
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with:
   PORT=3000
   CLIENT_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file with:
   VITE_API_URL=http://localhost:3000
   ```

### Running the Application

**Terminal 1 - Backend Server**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3000`

**Terminal 2 - Frontend Dev Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Play!**
   - Open `http://localhost:5173` in your first browser
   - Copy the room code from the home page
   - Open `http://localhost:5173` in another browser or incognito window
   - Paste the room code to join
   - Start playing chess!

## 🎮 How to Play

1. **Create a Game** - Click "Create Game" to get a unique room code
2. **Share the Code** - Send the room code to your opponent
3. **Join the Game** - Opponent enters the room code and joins
4. **Make Moves** - Click on a piece to select it, then click on a square to move
   - Valid moves are highlighted in green
   - Your king appears red when in check
5. **Chat** - Click the chat icon to send messages to your opponent
6. **Game End** - The game ends with checkmate, stalemate, or resignation
   - Game result is displayed in the status bar

## 🔧 Development

### Available Scripts

**Backend**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (not configured)
```

**Frontend**
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Configuration Files

- **backend/.env** - Backend environment variables
- **frontend/.env** - Frontend environment variables
- **vite.config.js** - Vite build configuration
- **eslint.config.js** - ESLint rules for code quality

## 📡 Socket Events

### Game Events
- `join_room` - Player joins a game room
- `send_move` - Player makes a chess move
- `resign` - Player resigns from the game
- `player_resigned` - Announce resignation to all players
- `leave_room` - Player leaves the game

### Chat Events
- `join_chat_room` - Player joins chat room
- `send_message` - Player sends a message
- `receive_message` - Broadcast message to room
- `chat_history` - Load previous messages on join

## 🎨 Architecture Highlights

### State Management
- **React Context API** - Global state for game, socket, and user data
- **Local State** - Component-level state for UI interactions
- **Server-Side Storage** - In-memory game rooms and chat history

### Real-Time Communication
- Bidirectional communication via Socket.io
- Event-driven architecture for responsive updates
- Automatic reconnection handling

### Game Logic
- Move validation using chess.js library
- Checkmate and stalemate detection
- Turn-based gameplay with clear indicators

### Chat Features
- Message persistence (100 messages per room)
- Unread message indicators
- Timestamp and sender information
- Auto-focus input when chat opens

## 📱 Responsive Features

- Mobile-friendly board and UI
- Touch-friendly controls
- Responsive chat interface
- Works on all screen sizes

## 🐛 Troubleshooting

### Connection Issues
- Ensure both backend and frontend are running
- Check that the CLIENT_URL in backend .env matches your frontend URL
- Clear browser cache and refresh

### Move Not Working
- Verify it's your turn (check status bar)
- Ensure the move is legal (piece can reach destination)
- Check browser console for errors

### Chat Not Showing
- Make sure you're in the correct room
- Try scrolling to the bottom of chat history
- Check if opponent has sent a message

## 📦 Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend (no build step needed, uses ES modules directly)
cd backend
npm start
```

Deploy both frontend and backend to your hosting platform:
- Frontend can be deployed to Vercel, Netlify, or any static hosting
- Backend can be deployed to Heroku, AWS, or any Node.js hosting

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for any improvements!

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🎯 Project Status

✅ **Complete** - All core features implemented and tested
- Real-time chess gameplay
- Chat with persistence
- Game result display
- Unread notifications
- Responsive design

## 🚀 Future Enhancements

- User authentication and profiles
- Game history and statistics
- Rating system
- Timed games
- Game replays
- Mobile app

## 👨‍💻 Author

Created as a full-stack MERN project demonstrating real-time multiplayer game development.

---

**Enjoy your game!** ♟️

Have questions? Feel free to open an issue or reach out!
