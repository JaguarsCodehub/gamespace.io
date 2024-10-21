import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io('http://localhost:3001'); // Your backend URL
    socket.on('connect', () => {
      setConnected(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMove = (data: Socket) => {
    socket.emit('move', data);
  };

  return { connected, sendMove };
};
