class Player {
  id: string;
  x: number;
  y: number;

  constructor(id: string, x: number = 400, y: number = 300) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

export default Player;
