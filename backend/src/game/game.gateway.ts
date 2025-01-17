import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { GameService } from './game.service';

@WebSocketGateway({
  path: '/game',
})
export class GameGateway {
  constructor(private gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('init')
  handleMessage(client: WebSocket, payload: any): void {
    this.gameService.init(payload.name);
    console.log(payload);
  }

  afterInit() {
    console.log('wss connected');
  }
}
