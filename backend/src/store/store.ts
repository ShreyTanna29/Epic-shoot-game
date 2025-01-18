import { Player } from 'src/types/player.type';
import { Room } from 'src/types/room.type';
import { createEnemy } from 'src/utils/createEnemy.util';
import WebSocket from 'ws';

export class Store {
  private waitingPlayers: Player[] = [];
  private rooms: Room[] = [];
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

  sendEnemies(roomId: number) {
    const currentRoom = this.rooms.find((room) => room.id === roomId);
    setInterval(() => {
      const enemy = createEnemy(
        currentRoom.player1Details.canvasWidth,
        currentRoom.player1Details.canvasHeight,
      );
      currentRoom.player1Client.send(JSON.stringify(enemy));
      currentRoom.player2Client.send(JSON.stringify(enemy));
    }, 1000);
  }
}
