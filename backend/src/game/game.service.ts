import { Injectable } from '@nestjs/common';
import { Store } from 'src/store/store';
import { Player } from 'src/types/player.type';
import { WebSocket } from 'ws';

@Injectable()
export class GameService {
  private instance = Store.getInstance();
  private clientsArray: WebSocket[] = [];

  init(name: string, client: WebSocket) {
    this.instance.addPlayer(name);
    this.clientsArray.push(client);
    const waitingPlayersList = this.instance.getWaitingList();
    console.log(this.instance.getWaitingList());

    if (waitingPlayersList.length >= 2) {
      // NOTE: here player1 and player2 contains details of player and PlayerClient1 and PlayerClient2 contains WebSocket Client of both players, so to send data use PlayerClient1 or PlayerCLient2.
      const player1: Player = waitingPlayersList.shift();
      const player2: Player = waitingPlayersList.shift();
      const PlayerClient1 = this.clientsArray.shift();
      const PlayerClient2 = this.clientsArray.shift();

      console.log(this.instance.getWaitingList());

      PlayerClient1.send(
        JSON.stringify({
          data: {
            opponent: player2.name,
          },
        }),
      );

      PlayerClient2.send(
        JSON.stringify({
          data: {
            opponent: player1.name,
          },
        }),
      );
    }
  }
}
