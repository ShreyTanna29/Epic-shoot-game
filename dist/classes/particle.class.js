"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Particle = void 0;
class Particle {
    constructor(x, y, radius, color, velocity, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.opacity = 1;
    }
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    }
    update() {
        this.draw();
        //adding friction so particels. so particles are slowed down.
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 0.01;
    }
}
exports.Particle = Particle;
