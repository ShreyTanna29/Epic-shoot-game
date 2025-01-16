export class Enemy {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public radius: number;
  public velocity: { x: number; y: number };
  public color: string;
  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
