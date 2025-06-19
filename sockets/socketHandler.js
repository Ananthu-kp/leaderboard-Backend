import redis from "../config/redisClient.js";

export default (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('scoreUpdate', async ({ playerId, name, score, region, mode }) => {
      const today = new Date().toISOString().split('T')[0]; 
      const key = `leaderboard:${region}:${mode}:${today}`; 
      const playerKey = `player:${playerId}`;

      await redis.zincrby(key, score, playerId);
      await redis.hset(playerKey, { name, region, mode });

      const ttl = await redis.ttl(key);
      if (ttl === -1) {
        await redis.expire(key, 86400); // 24 hours
      }

      const top = await redis.zrevrange(key, 0, 9, 'WITHSCORES');
      const players = [];

      for (let i = 0; i < top.length; i += 2) {
        const id = top[i];
        const scr = top[i + 1];
        const meta = await redis.hgetall(`player:${id}`);
        players.push({ id, name: meta.name, score: Number(scr) });
      }

      io.emit('leaderboardUpdated', players); 
    });

    socket.on('getLeaderboard', async ({ region, mode, limit = 10 }) => {
      const today = new Date().toISOString().split('T')[0];
      const key = `leaderboard:${region}:${mode}:${today}`;
      const top = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
      const players = [];

      for (let i = 0; i < top.length; i += 2) {
        const id = top[i];
        const scr = top[i + 1];
        const meta = await redis.hgetall(`player:${id}`);
        players.push({ id, name: meta.name, score: Number(scr) });
      }

      socket.emit('leaderboardResult', players); 
    });
  });
};
