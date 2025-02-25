export class Player {
  private ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public radius: number;
  public color: string;
  public id: number;
  public avatar: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    avatarImage: string
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.id = crypto.getRandomValues(new Uint32Array(1))[0];
    this.avatar = new Image();
    this.avatar.src = avatarImage;
  }

  draw() {
    this.ctx.save();

    // Create a circular clipping mask
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.clip();

    this.ctx.fillStyle = "rgba(255, 255, 255, 0)"; // Transparent fill
    this.ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    // Draw the avatar image
    this.ctx.drawImage(
      this.avatar,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    this.ctx.restore();
  }
}
