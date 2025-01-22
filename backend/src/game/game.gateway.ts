import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { GameService } from './game.service';
import { InitGameDto } from './dto/init-game.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/exceptionFilters/WsException.filter';
import { EndGameDto } from './dto/end-game.dto';
import { FireBulletDto } from './dto/fire-bullet.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  path: '/game',
})
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      }));
      return new WsException(result);
    },
  }),
)
@UseFilters(WebSocketExceptionFilter)
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

  @SubscribeMessage('fireBullet')
  handleFireBullet(client: WebSocket, payload: FireBulletDto) {
    this.gameService.fireBullet(payload);
  }

  /* 
END GAME PAYLOAD STRUCTURE
{
"event": "endGame",
"data": {
"playerId": 123,
"roomId": 123
}
}
*/

  @SubscribeMessage('endGame')
  handleEndGame(client: WebSocket, payload: EndGameDto) {
    this.gameService.endGame(payload);
  }
}
