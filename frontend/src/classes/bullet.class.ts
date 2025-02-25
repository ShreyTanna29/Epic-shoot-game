export class Bullet {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public radius: number;
  public velocity: { x: number; y: number };
  public opponentBullet?: boolean;

  constructor(
    x: number,
    y: number,
    radius: number,
    velocity: { x: number; y: number },
    ctx: CanvasRenderingContext2D,
    opponentBullet?: boolean
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.opponentBullet = opponentBullet;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    const isDark = document.documentElement.classList.contains("dark");
    this.ctx.fillStyle = `${isDark ? "white" : "black"}`;
    this.ctx.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
