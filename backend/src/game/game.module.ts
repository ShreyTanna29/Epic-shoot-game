import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { APP_FILTER } from '@nestjs/core';
import { WebSocketExceptionFilter } from 'src/exceptionFilters/WsException.filter';

@Module({
  providers: [
    GameService,
    GameGateway,
    {
      provide: APP_FILTER,
      useClass: WebSocketExceptionFilter,
    },
  ],
})
export class GameModule {}
