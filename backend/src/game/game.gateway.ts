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

  @SubscribeMessage('init')
  handleMessage(client: WebSocket, payload: InitGameDto): void {
    this.gameService.init(payload.name, client);
  }

  afterInit() {
    console.log('wss connected');
  }
}
