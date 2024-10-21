'use client';
import {  useState } from 'react';
// import * as Phaser from 'phaser';
// import GameScene from '@/game/game-scene';
import GameContainer from '@/components/GameContainer';

export default function HomePage() {

  const [roomName, setRoomName] = useState<string | null>(null);
  const [inputRoomName, setInputRoomName] = useState('');

  const joinRoom = () => {
    if(inputRoomName) {
      setRoomName(inputRoomName);
    }
  };

  
  // useEffect(() => {
  //   // Set up Phaser game
  //   const config: Phaser.Types.Core.GameConfig = {
  //     type: Phaser.AUTO,
  //     width: 800,
  //     height: 600,
  //     scene: GameScene,
  //     parent: 'game-container',
  //   };

  //   const game = new Phaser.Game(config);

  //   return () => {
  //     game.destroy(true);  // Cleanup Phaser on component unmount
  //   };
  // }, []);

  return (
    <div>
      <h1>Phaser Game with Socket.IO</h1>
      {!roomName ? (
        <div>
          <h2>Enter Room Name</h2>
          <input
            type='text'
            value={inputRoomName}
            onChange={(e) => setInputRoomName(e.target.value)}
            placeholder='Room name'
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <GameContainer roomName={roomName} />
      )}
    </div>
  );
}
