import { IsNotEmpty, IsNumber } from 'class-validator';
export class HitEnemyDto {
  @IsNotEmpty()
  @IsNumber()
  playerId: number;

  @IsNotEmpty()
  @IsNumber()
  enemyId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;
}
