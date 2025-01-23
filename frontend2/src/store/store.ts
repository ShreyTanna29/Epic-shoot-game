import { Bullet, Enemy, Particle } from "../classes";

export let bulletsArray: Bullet[] = [];
export let enemiesArray: Enemy[] = [];
export let particlesArray: Particle[] = [];

export function clearArrays(): void {
  bulletsArray = [];
  enemiesArray = [];
  particlesArray = [];
}

export function setBulletsArray(newArray: Bullet[]) {
  bulletsArray = newArray;
}

export function setEnemiesArray(newArray: Enemy[]) {
  enemiesArray = newArray;
}

export function setParticlesArray(newArray: Particle[]) {
  particlesArray = newArray;
}
