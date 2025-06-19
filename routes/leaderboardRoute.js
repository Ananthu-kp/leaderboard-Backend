import express from 'express';
import leaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();

router.post('/update', leaderboardController.updateScore);
router.get('/top', leaderboardController.getTopPlayers);

export default router;