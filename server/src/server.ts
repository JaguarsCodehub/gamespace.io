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

// Store players per room
const rooms: { [room: string]: { [id: string]: Player } } = {};

// API route (example)
app.get('/api/test', (req, res) => {
  res.send('Backend is running');
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('joinRoom', (roomName: string) => {
    if (!rooms[roomName]) {
      rooms[roomName] = {};
    }
  
    // Create new player and add them to the room
    const player = new Player(socket.id);
    rooms[roomName][socket.id] = player;
    socket.join(roomName);

    // Send the current players in the room to the new player
    socket.emit('currentPlayers', rooms[roomName]);

    // Notify other players in the room about the new player
    socket.to(roomName).emit('playerConnected', player);

    // Handle player movement within the room
    socket.on('move', (data: { x: number; y: number }) => {
      const player = rooms[roomName][socket.id];
      if (player) {
        player.x = data.x;
        player.y = data.y;
        // Broadcast the updated position to other players in the room
        socket.to(roomName).emit('playerMoved', { id: player.id, x: player.x, y: player.y });
      }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      delete rooms[roomName][socket.id];
      // Notify other players in the room about the disconnection
      socket.to(roomName).emit('playerDisconnected', socket.id);
    });
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
