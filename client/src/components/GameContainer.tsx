// 'use client';
import { useEffect } from 'react';
import * as Phaser from 'phaser';
import GameScene from '@/game/game-scene';

const GameContainer = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: GameScene,
      parent: 'game-container',
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);  // Cleanup Phaser when component is unmounted
    };
  }, []);

  return <div id="game-container" />;
};

export default GameContainer;
