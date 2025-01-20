import { IsNotEmpty, IsNumber } from 'class-validator';
export class EndGameDto {
  @IsNotEmpty()
  @IsNumber()
  playerId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
