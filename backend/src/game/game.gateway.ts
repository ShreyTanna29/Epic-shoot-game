import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { GameService } from './game.service';
import { InitGameDto } from './dto/init-game.dto';
import { HitEnemyDto } from './dto/hit-enemy.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/exceptionFilters/WsException.filter';
import { EndGameDto } from './dto/end-game.dto';

@WebSocketGateway({
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

  /*  
  DATA STRUCTURE OF HITENEMY MESSAGE

  {
  "event": "hitEnemy",
  "data": {
  "playerId": id of player,
  "enemyId": id of enemy,
  "roomId": id of room
  }
  }
  
  */
  @SubscribeMessage('hitEnemy')
  handleHitEnemy(client: WebSocket, payload: HitEnemyDto) {
    this.gameService.hitEnemy(payload);
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
