import * as Phaser from 'phaser';
import socket from './socket';
// import { Socket } from 'socket.io-client';

interface Player {
  id: string;
  x: number;
  y: number;
  
}

export default class GameScene extends Phaser.Scene {
  private players: { [id: string]: Phaser.GameObjects.Rectangle } = {};
  private static readonly PLAYER_SIZE = 25;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Initialize the players object
    this.players = {};

    // Set up socket event listeners
    this.setupSocketListeners();

    // Set up keyboard input
    this.setupKeyboardInput();
  }

  private setupSocketListeners() {
    socket.on('currentPlayers', (players: { [id: string]: Player }) => {
      Object.values(players).forEach((player) => {
        this.addPlayer(player);
      });
    });

    socket.on('playerConnected', (player: Player) => {
      this.addPlayer(player);
    });

    socket.on('playerMoved', (data: Player) => {
      this.movePlayer(data);
    });

    socket.on('playerDisconnected', (playerId: string) => {
      this.removePlayer(playerId);
    });
  }

  private setupKeyboardInput() {
    this.input.keyboard?.on('keydown-W', () => this.moveLocalPlayer(0, -10));
    this.input.keyboard?.on('keydown-S', () => this.moveLocalPlayer(0, 10));
    this.input.keyboard?.on('keydown-A', () => this.moveLocalPlayer(-10, 0));
    this.input.keyboard?.on('keydown-D', () => this.moveLocalPlayer(10, 0));
  }

  private addPlayer(player: Player) {
    try {
      if (this.players[player.id]) return;

      console.log('Adding player:', player.id);
      const newPlayer = this.add.rectangle(player.x, player.y, GameScene.PLAYER_SIZE, GameScene.PLAYER_SIZE, 0xff0000);
      this.players[player.id] = newPlayer;
      console.log('Player added successfully');
    } catch (error) {
      console.error('Error adding player:', error);
    }
  }

  private movePlayer(player: Player) {
    const playerObject = this.players[player.id];
    if (playerObject) {
      playerObject.setPosition(player.x, player.y);
    }
  }

  private moveLocalPlayer(dx: number, dy: number) {
    const localPlayer = this.players[socket.id || ''];
    if (localPlayer) {
      const newX = localPlayer.x + dx;
      const newY = localPlayer.y + dy;

      localPlayer.setPosition(newX, newY);

      if (socket.connected) {
        socket.emit('move', { x: newX, y: newY });
      } else {
        console.warn('Socket is not connected. Unable to send move event.');
      }
    }
  }

  private removePlayer(playerId: string) {
    const player = this.players[playerId];
    if (player) {
      player.destroy();
      delete this.players[playerId];
    }
  }
}
