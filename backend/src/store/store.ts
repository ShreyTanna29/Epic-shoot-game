import { EndGameDto } from 'src/game/dto/end-game.dto';
import { FireBulletDto } from 'src/game/dto/fire-bullet.dto';
import { Enemy } from 'src/types/enemy.type';
import { Player } from 'src/types/player.type';
import { Room } from 'src/types/room.type';
import { createEnemy } from 'src/utils/createEnemy.util';
import WebSocket from 'ws';

export class Store {
  private waitingPlayers: Player[] = [];
  private rooms: Room[] = [];
  private enemies: Enemy[] = [];
  static store: Store;

  private constructor() {}

  static getInstance() {
    if (!Store.store) {
      Store.store = new Store();
      return Store.store;
    }
    return Store.store;
  }

  addPlayer(name: string, canvasWidth: number, canvasHeight: number) {
    this.waitingPlayers.push({
      id: Math.random(),
      name,
      canvasWidth,
      canvasHeight,
    });
  }

  getWaitingList() {
    return this.waitingPlayers;
  }

  createRoom(
    player1Details: Player,
    player2Details: Player,
    player1Client: WebSocket,
    player2Client: WebSocket,
  ) {
    const roomId = Math.random();
    this.rooms.push({
      player1Details,
      player2Details,
      player1Client,
      player2Client,
      id: roomId,
      intervalId: null,
    });
    return roomId;
  }

  async sendEnemies(roomId: number) {
    const currentRoom = this.rooms.find((room) => room.id === roomId);
    currentRoom.intervalId = setInterval(() => {
      const enemy: Enemy = createEnemy(100, 100);
      const enemy1 = {
        ...enemy,
        x: (enemy.x / 100) * currentRoom.player1Details.canvasWidth,
        y: (enemy.y / 100) * currentRoom.player1Details.canvasHeight,
      };
      const enemy2 = {
        ...enemy,
        x: (enemy.x / 100) * currentRoom.player2Details.canvasWidth,
        y: (enemy.y / 100) * currentRoom.player2Details.canvasHeight,
      };
      this.enemies.push(enemy);
      currentRoom.player1Client.send(
        JSON.stringify({
          event: 'createEnemy',
          data: {
            enemy: enemy1,
          },
        }),
      );
      currentRoom.player2Client.send(
        JSON.stringify({
          event: 'createEnemy',
          data: {
            enemy: enemy2,
          },
        }),
      );
    }, 1000);
  }

  fireBullet(bulletDetails: FireBulletDto) {
    const room = this.rooms.find((room) => room.id === bulletDetails.roomId);

    if (room.player1Details.id === bulletDetails.playerId) {
      room.player2Client.send(
        JSON.stringify({
          event: 'fireBullet',
          data: {
            bullet: {
              x: bulletDetails.x,
              y: bulletDetails.y,
              radius: bulletDetails.radius,
              velocity: bulletDetails.velocity,
            },
          },
        }),
      );
    } else {
      room.player1Client.send(
        JSON.stringify({
          event: 'fireBullet',
          data: {
            bullet: {
              x: bulletDetails.x,
              y: bulletDetails.y,
              radius: bulletDetails.radius,
              velocity: bulletDetails.velocity,
            },
          },
        }),
      );
    }
  }

  endGame(playerDetails: EndGameDto) {
    const room = this.rooms.find((room) => room.id === playerDetails.roomId); // finding room
    clearInterval(room.intervalId); // clearing enemies interval id, so enemy generation gets stopped
    this.rooms = this.rooms.filter((room) => room.id !== playerDetails.roomId); // removing room from rooms array
  }
}
