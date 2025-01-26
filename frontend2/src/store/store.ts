import { create } from "zustand";
import { Bullet, Enemy, Particle, Player } from "../classes";

interface GameState {
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  players: Player[];
  score: number;
  animationId: number;
  multiplayer: boolean;
  playerNumber: number;
  gameWon: boolean;
  gameLost: boolean;
  gameStarted: boolean;

  // Actions
  addBullet: (bullet: Bullet) => void;
  removeBullet: (index: number) => void;
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (index: number) => void;
  addParticle: (particle: Particle) => void;
  removeParticle: (index: number) => void;
  addPlayer: (player: Player) => Player;
  removePlayer: (playerId: number) => void;
  updatePlayer: (playerId: number, updates: Partial<Player>) => void;
  clearArrays: () => void;
  setScore: (score: number) => void;
  setAnimationId: (id: number) => void;
  setMultiplayer: (value: boolean) => void;
  setPlayerNumber: (num: number) => void;
  setGameWon: (value: boolean) => void;
  setGameLost: (value: boolean) => void;
  setGameStarted: (value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  bullets: [],
  enemies: [],
  particles: [],
  players: [],
  score: 0,
  animationId: 0,
  multiplayer: false,
  playerNumber: 0,
  gameWon: false,
  gameLost: false,
  gameStarted: false,

  addBullet: (bullet: Bullet) =>
    set((state: GameState) => ({ bullets: [...state.bullets, bullet] })),
  removeBullet: (index: number) =>
    set((state: GameState) => ({
      bullets: state.bullets.filter((_, i: number) => i !== index),
    })),

  addEnemy: (enemy: Enemy) =>
    set((state: GameState) => ({ enemies: [...state.enemies, enemy] })),
  removeEnemy: (index: number) =>
    set((state: GameState) => ({
      enemies: state.enemies.filter((_, i) => i !== index),
    })),

  addParticle: (particle: Particle) =>
    set((state: GameState) => ({ particles: [...state.particles, particle] })),
  removeParticle: (index: number) =>
    set((state: GameState) => ({
      particles: state.particles.filter((_, i) => i !== index),
    })),

  addPlayer: (player: Player) => {
    set((state: GameState) => ({ players: [...state.players, player] }));
    return player;
  },

  removePlayer: (playerId: number) =>
    set((state: GameState) => ({
      players: state.players.filter((player) => player.id !== playerId),
    })),

  updatePlayer: (playerId: number, updates: Partial<Player>) =>
    set((state) => ({
      players: state.players.map((player) =>
        player.id === playerId ? ({ ...player, ...updates } as Player) : player
      ),
    })),

  clearArrays: () =>
    set(() => ({
      bullets: [],
      enemies: [],
      particles: [],
      players: [],
    })),

  setScore: (score: number) => set(() => ({ score })),
  setAnimationId: (id: number) => set(() => ({ animationId: id })),
  setMultiplayer: (value: boolean) => set(() => ({ multiplayer: value })),
  setPlayerNumber: (num: number) => set(() => ({ playerNumber: num })),
  setGameWon: (value: boolean) => set(() => ({ gameWon: value })),
  setGameLost: (value: boolean) => set(() => ({ gameLost: value })),
  setGameStarted: (value: boolean) => set(() => ({ gameStarted: value })),
}));
