import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import leaderboardRoute from './routes/leaderboardRoute.js';
import socketHandler from './sockets/socketHandler.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', leaderboardRoute);

socketHandler(io);

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});