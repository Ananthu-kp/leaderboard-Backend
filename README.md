# 🏆 leaderboard-system

A real-time leaderboard backend built with **Node.js**, **Socket.io**, and **Redis**, capable of tracking player scores across regions and game modes with daily auto-reset functionality.

---

## 📌 Features

- 🔄 Real-time score updates using WebSockets  
- ⚡ High-performance using Redis Sorted Sets (ZSET)  
- 📊 Top N player retrieval with filtering by region & mode  
- ♻️ Auto-reset leaderboard daily using TTL  
- 🌐 Supports both REST API and Socket.io  
- 📦 Well-structured project with modular folder architecture  

---

## 🛠️ Tech Stack

- **Node.js + Express** – Web framework  
- **Redis** – Real-time data storage  
- **Socket.io** – WebSockets for real-time communication  
- **REST API** – Fallback and testable endpoints  

---

## 🌐 REST API Endpoints

### 🔼 POST `/api/leaderboard/update`

Update or increment a player’s score.

**Example request body:**
```json
{
  "playerId": "p1",
  "name": "Ananthu",
  "score": 50,
  "region": "asia",
  "mode": "classic"
}
```

### 📥 GET /api/leaderboard/top?region=asia&mode=classic&limit=5
Fetch the top N players for a specific region and game mode.

## 🧱 Project Structure

leaderboard-system/
├── config/
│   └── redisClient.js          # Redis connection
├── controllers/
│   └── leaderboardController.js # REST API logic
├── routes/
│   └── leaderboardRoute.js     # REST API routes
├── sockets/
│   └── socketHandler.js        # WebSocket logic
├── index.js                    # Server entry point
├── .gitignore                  # Git ignore file
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

📦 Install Dependencies
```
npm install
```

🚀 Start Redis Server
```
redis-server
```

🧪 Run the App
```
npm start
```
Server will run at: http://localhost:3000
