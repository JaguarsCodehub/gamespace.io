import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000'); // Connect to the backend Socket.IO server

export default socket;
