import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar/navbar';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import { GameProvider } from './context/GameContext';
import { SocketProvider } from './context/SocketContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <GameProvider>
          <Router>
            <div className="h-screen bg-white flex flex-col overflow-hidden">
              <Navbar />
              <div className="flex-1 overflow-hidden min-h-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game/:roomId" element={<GameRoom />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  theme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </GameProvider>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
