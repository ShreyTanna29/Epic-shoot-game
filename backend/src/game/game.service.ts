import { Injectable } from '@nestjs/common';
import { waitingPlayers } from 'src/store/store';

@Injectable()
export class GameService {
  init(name: string) {
    waitingPlayers.push(name);
    console.log(waitingPlayers);
  }
}
