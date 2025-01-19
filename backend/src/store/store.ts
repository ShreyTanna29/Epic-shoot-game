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
    });
    return roomId;
  }

  async sendEnemies(roomId: number) {
    const currentRoom = this.rooms.find((room) => room.id === roomId);
    setInterval(() => {
      const enemy: Enemy = createEnemy(
        currentRoom.player1Details.canvasWidth,
        currentRoom.player1Details.canvasHeight,
      );
      this.enemies.push(enemy);
      currentRoom.player1Client.send(JSON.stringify(enemy));
      currentRoom.player2Client.send(JSON.stringify(enemy));
    }, 1000);
  }

  hitEnemy(roomId: number, enemyId: number, playerId: number) {
    const currentRoom = this.rooms.find((room) => room.id === roomId);
    const targetEnemy: Enemy = this.enemies.find(
      (enemy) => enemy.id === enemyId,
    );
    console.log('enemy: ', targetEnemy);
    const receiver =
      currentRoom.player1Details.id === playerId
        ? currentRoom.player2Client
        : currentRoom.player1Client;

    if (targetEnemy.radius - 5 >= 10) {
      targetEnemy.radius -= 5;
      receiver.send(
        JSON.stringify({ event: 'reduceEnemy', data: { enemyId } }),
      );
    } else {
      this.enemies.filter((enemy) => enemy.id !== enemyId);
      receiver.send(
        JSON.stringify({ event: 'removeEnemy', data: { enemyId } }),
      );
    }
  }
}
