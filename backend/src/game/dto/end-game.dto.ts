import { IsNotEmpty, IsNumber } from 'class-validator';
export class EndGameDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
