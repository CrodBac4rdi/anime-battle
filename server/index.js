const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Anime characters database (in-memory for now)
const animeCharacters = [
  {
    id: 1,
    name: "Goku",
    anime: "Dragon Ball Z",
    power: 95,
    speed: 88,
    defense: 85,
    special: "Kamehameha",
    image: "https://i.imgur.com/goku.jpg",
    description: "The legendary Super Saiyan warrior"
  },
  {
    id: 2,
    name: "Saitama",
    anime: "One Punch Man",
    power: 100,
    speed: 90,
    defense: 80,
    special: "One Punch",
    image: "https://i.imgur.com/saitama.jpg",
    description: "The hero who can defeat any enemy with one punch"
  },
  {
    id: 3,
    name: "Naruto",
    anime: "Naruto",
    power: 85,
    speed: 92,
    defense: 75,
    special: "Rasengan",
    image: "https://i.imgur.com/naruto.jpg",
    description: "The ninja who never gives up"
  },
  {
    id: 4,
    name: "Luffy",
    anime: "One Piece",
    power: 80,
    speed: 85,
    defense: 90,
    special: "Gum-Gum Pistol",
    image: "https://i.imgur.com/luffy.jpg",
    description: "The rubber pirate king"
  },
  {
    id: 5,
    name: "Ichigo",
    anime: "Bleach",
    power: 88,
    speed: 87,
    defense: 82,
    special: "Getsuga Tensho",
    image: "https://i.imgur.com/ichigo.jpg",
    description: "The substitute soul reaper"
  },
  {
    id: 6,
    name: "Light Yagami",
    anime: "Death Note",
    power: 60,
    speed: 70,
    defense: 65,
    special: "Death Note",
    image: "https://i.imgur.com/light.jpg",
    description: "The genius with a god complex"
  },
  {
    id: 7,
    name: "Edward Elric",
    anime: "Fullmetal Alchemist",
    power: 78,
    speed: 80,
    defense: 75,
    special: "Alchemy",
    image: "https://i.imgur.com/edward.jpg",
    description: "The Fullmetal Alchemist"
  },
  {
    id: 8,
    name: "Eren Yeager",
    anime: "Attack on Titan",
    power: 90,
    speed: 75,
    defense: 85,
    special: "Titan Transformation",
    image: "https://i.imgur.com/eren.jpg",
    description: "The Attack Titan wielder"
  }
];

// Battle results storage
let battleHistory = [];
let onlineUsers = 0;

// API Routes
app.get('/api/characters', (req, res) => {
  res.json(animeCharacters);
});

app.get('/api/character/:id', (req, res) => {
  const character = animeCharacters.find(c => c.id === parseInt(req.params.id));
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }
  res.json(character);
});

app.post('/api/battle', (req, res) => {
  const { player1Id, player2Id } = req.body;
  
  const player1 = animeCharacters.find(c => c.id === player1Id);
  const player2 = animeCharacters.find(c => c.id === player2Id);
  
  if (!player1 || !player2) {
    return res.status(400).json({ error: 'Invalid character selection' });
  }
  
  // Battle calculation
  const p1Total = player1.power + player1.speed + player1.defense;
  const p2Total = player2.power + player2.speed + player2.defense;
  
  // Add some randomness
  const p1Score = p1Total + Math.random() * 50;
  const p2Score = p2Total + Math.random() * 50;
  
  const winner = p1Score > p2Score ? player1 : player2;
  const loser = p1Score > p2Score ? player2 : player1;
  
  const battleResult = {
    id: Date.now(),
    player1,
    player2,
    winner,
    loser,
    p1Score: Math.round(p1Score),
    p2Score: Math.round(p2Score),
    timestamp: new Date().toISOString()
  };
  
  battleHistory.push(battleResult);
  
  // Broadcast to all connected clients
  io.emit('battleResult', battleResult);
  
  res.json(battleResult);
});

app.get('/api/battles', (req, res) => {
  res.json(battleHistory.slice(-10)); // Last 10 battles
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalBattles: battleHistory.length,
    onlineUsers: onlineUsers,
    popularCharacters: animeCharacters
      .map(char => ({
        ...char,
        battlesWon: battleHistory.filter(b => b.winner.id === char.id).length,
        battlesTotal: battleHistory.filter(b => b.player1.id === char.id || b.player2.id === char.id).length
      }))
      .sort((a, b) => b.battlesWon - a.battlesWon)
      .slice(0, 5)
  };
  res.json(stats);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  onlineUsers++;
  console.log(`User connected. Online users: ${onlineUsers}`);
  
  // Send current stats to new user
  socket.emit('userCount', onlineUsers);
  
  socket.on('disconnect', () => {
    onlineUsers--;
    console.log(`User disconnected. Online users: ${onlineUsers}`);
  });
  
  socket.on('joinBattle', (data) => {
    socket.join('battle-room');
    socket.broadcast.to('battle-room').emit('playerJoined', data);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Anime Battle Arena server running on port ${PORT}`);
  console.log(`📊 Loaded ${animeCharacters.length} anime characters`);
});

module.exports = app;