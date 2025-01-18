import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { GameService } from './game.service';
import { InitGameDto } from './dto/init-game.dto';
import { HitEnemyDto } from './dto/hit-enemy.dto';

@WebSocketGateway({
  path: '/game',
})
export class GameGateway {
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  /* THIS IS HOW WS MESSAGE LOOK LIKE:

 {
  "event":"init",
  "data":{
    "name":"abc",
    "canvasWidth":100,
    "canvasHeight":100
  }
 }
  
  */
  @SubscribeMessage('init')
  handleInit(client: WebSocket, payload: InitGameDto): void {
    this.gameService.init(payload, client);
  }

  afterInit() {
    console.log('wss connected');
  }

  /*  
  DATA STRUCTURE OF HITENEMY MESSAGE

  {
  event: "HitEnemy",
  data: {
  playerId: id of player,
  EnemyId: id of enemy,
  roomId: id of room
  }
  }
  
  */
  @SubscribeMessage('HitEnemy')
  handleHitEnemy(client: WebSocket, payload: HitEnemyDto) {
    this.gameService.hitEnemy(payload);
  }
}
