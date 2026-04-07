import { Router } from 'express';
import { createGame, joinGame, getGame } from '../controllers/game.controller.js';

const router = Router();

router.post('/create', createGame);
router.post('/join', joinGame);
router.get('/:roomId', getGame);

export default router;
