import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Player from './models/Player';

// Create express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from the frontend
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Store connected players
const players: { [id: string]: Player } = {};

// API route (example)
app.get('/api/test', (req, res) => {
  res.send('Backend is running');
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create new player
  const player = new Player(socket.id);
  players[socket.id] = player;

  // Broadcast the new player to all clients
  io.emit('playerConnected', player);

  // Send the current list of players to the newly connected client
  socket.emit('currentPlayers', players);

  // Handle player movement
  socket.on('move', (data: { x: number; y: number }) => {
    const player = players[socket.id];
    if (player) {
      player.x = data.x;
      player.y = data.y;

      // Broadcast updated position to all other clients
      socket.broadcast.emit('playerMoved', {
        id: player.id,
        x: player.x,
        y: player.y,
      });
    }
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];

    // Broadcast the player disconnection to all clients
    io.emit('playerDisconnected', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
