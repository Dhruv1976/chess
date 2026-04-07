import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/game.routes.js';
import errorHandler from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/games', gameRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Backend is working!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});
app.use(errorHandler);

export default app;