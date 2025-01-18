import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { GameService } from './game.service';
import { InitGameDto } from './dto/init-game.dto';

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
  handleMessage(client: WebSocket, payload: InitGameDto): void {
    this.gameService.init(payload, client);
  }

  afterInit() {
    console.log('wss connected');
  }
}
