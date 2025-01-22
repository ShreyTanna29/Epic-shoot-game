import { Injectable } from '@nestjs/common';
import { Store } from 'src/store/store';
import { Player } from 'src/types/player.type';
import { WebSocket } from 'ws';
import { InitGameDto } from './dto/init-game.dto';
import { EndGameDto } from './dto/end-game.dto';
import { FireBulletDto } from './dto/fire-bullet.dto';

@Injectable()
export class GameService {
  private instance = Store.getInstance();
  private clientsArray: WebSocket[] = [];

  init(playerDetails: InitGameDto, client: WebSocket) {
    // adding player to waiting array till another player joins
    this.instance.addPlayer(
      playerDetails.name,
      playerDetails.canvasWidth,
      playerDetails.canvasHeight,
    );
    this.clientsArray.push(client);
    const waitingPlayersList = this.instance.getWaitingList();

    if (waitingPlayersList.length >= 2) {
      // NOTE: here player1 and player2 contains details of player and PlayerClient1 and PlayerClient2 contains WebSocket Client of both players, so to send data use PlayerClient1 or PlayerCLient2.
      const player1: Player = waitingPlayersList.shift();
      const player2: Player = waitingPlayersList.shift();
      const PlayerClient1 = this.clientsArray.shift();
      const PlayerClient2 = this.clientsArray.shift();

      const roomId = this.instance.createRoom(
        player1,
        player2,
        PlayerClient1,
        PlayerClient2,
      );

      PlayerClient1.send(
        JSON.stringify({
          event: 'start',
          data: {
            opponent: { name: player2.name },
            player: {
              name: player1.name,
              id: player1.id,
              number: 1,
              roomId,
            },
          },
        }),
      );

      PlayerClient2.send(
        JSON.stringify({
          event: 'start',
          data: {
            opponent: { name: player1.name },
            player: {
              name: player2.name,
              id: player2.id,
              number: 2,
              roomId,
            },
          },
        }),
      );

      this.instance.sendEnemies(roomId);
    }
  }

  fireBullet(bulletDetails: FireBulletDto) {
    this.instance.fireBullet(bulletDetails);
  }

  endGame(playerDetails: EndGameDto) {
    this.instance.endGame(playerDetails);
  }
}
