'use client';
import { useEffect } from 'react';
import * as Phaser from 'phaser';
import GameScene from '@/game/game-scene';

export default function HomePage() {
  useEffect(() => {
    // Set up Phaser game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: GameScene,
      parent: 'game-container',
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);  // Cleanup Phaser on component unmount
    };
  }, []);

  return (
    <div>
      <h1>Phaser Game with Socket.IO</h1>
      <div id="game-container"></div>
    </div>
  );
}
