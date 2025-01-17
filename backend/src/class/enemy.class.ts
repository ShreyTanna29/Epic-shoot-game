export default class Enemy {
  public x: number;
  public y: number;
  public radius: number;
  public color: string;
  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
}
