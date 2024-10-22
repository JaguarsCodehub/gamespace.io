class Player {
  id: string;
  x: number;
  y: number;
  avatar: string;

  constructor(id: string, x: number = 400, y: number = 300, avatar: string = '') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.avatar = avatar;
  }
}

export default Player;
