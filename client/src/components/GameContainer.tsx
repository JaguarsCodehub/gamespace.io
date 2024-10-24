'use client';

import { useEffect } from 'react';
import * as Phaser from 'phaser';
import GameScene from '@/game/game-scene';
import socket from '@/game/socket'; // Import your Socket.IO client setup

interface GameContainerProps {
  roomName: string;
}

const GameContainer: React.FC<GameContainerProps> = ({ roomName }) => {
  useEffect(() => {
    // Join the specified room
    socket.emit('joinRoom', roomName);

    // Initialize Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: GameScene,
      parent: 'game-container',
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true); // Cleanup Phaser when component is unmounted
    };
  }, [roomName]);

  return <div id='game-container' />;
};

export default GameContainer;
