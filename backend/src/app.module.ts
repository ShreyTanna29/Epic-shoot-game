import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GameModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available throughout the app
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
