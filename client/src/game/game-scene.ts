import * as Phaser from 'phaser';
import socket from './socket';

interface Player {
  id: string;
  x: number;
  y: number;
  avatar?: string;
}

export default class GameScene extends Phaser.Scene {
  private players: { [id: string]: Phaser.GameObjects.Image } = {};
  private static readonly PLAYER_SIZE = 60;
  private roomName: string = 'default'; // You can change this or make it dynamic

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Preload assets if needed   
    this.load.image('background', '/assets/map.png');
    this.load.image('avatar1', '/assets/avatar1.png');
    this.load.image('avatar2', '/assets/avatar2.png');
    console.log('Assets preloaded');
  }

  create() {
    // Initialize the players object
    this.players = {};

    // Add a background image
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    // Join a room
    socket.emit('joinRoom', this.roomName);

    // Set up socket event listeners
    this.setupSocketListeners();

    // Set up keyboard input
    this.setupKeyboardInput();

    // Request current players from the server
    socket.emit('getPlayers');
  }

  private setupSocketListeners() {
    socket.on('currentPlayers', (players: { [id: string]: Player }) => {
      console.log('Received currentPlayers:', players);
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
      if (this.players[player.id]) {
        console.log('Player already exists:', player.id);
        return;
      }

      // Assign a random avatar if not provided
      const avatars = ['avatar1', 'avatar2'];
      const avatarKey = player.avatar || avatars[Math.floor(Math.random() * avatars.length)];

      console.log('Adding player:', player.id, 'with avatar:', avatarKey);
      const newPlayer = this.add.image(player.x, player.y, avatarKey);
      newPlayer.setScale(GameScene.PLAYER_SIZE / newPlayer.width);

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
