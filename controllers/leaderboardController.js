import redis from "../config/redisClient.js";

const updateScore = async (req, res) => {
  const { playerId, name, score, region, mode } = req.body;

  if (!playerId || !name || !score || !region || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const today = new Date().toISOString().split('T')[0]; 
  const key = `leaderboard:${region}:${mode}:${today}`;
  const playerKey = `player:${playerId}`;

  try {
    await redis.zincrby(key, score, playerId);
    await redis.hset(playerKey, { name, region, mode });

    const ttl = await redis.ttl(key);
    if (ttl === -1) {
      await redis.expire(key, 86400); // 24 hours
    }

    res.status(200).json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
};

const getTopPlayers = async (req, res) => {
  const { region, mode, limit = 10 } = req.query;

  if (!region || !mode) {
    return res.status(400).json({ error: 'Missing region or mode' });
  }

  const today = new Date().toISOString().split('T')[0];
  const key = `leaderboard:${region}:${mode}:${today}`;

  try {
    const top = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
    const players = [];

    for (let i = 0; i < top.length; i += 2) {
      const id = top[i];
      const score = top[i + 1];
      const meta = await redis.hgetall(`player:${id}`);
      players.push({ id, name: meta.name, score: Number(score) });
    }

    res.status(200).json(players);
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

export default {
  updateScore,
  getTopPlayers,
};