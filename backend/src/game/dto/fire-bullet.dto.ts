import { IsNumber, IsObject } from 'class-validator';

export class FireBulletDto {
  @IsNumber()
  roomId: number;

  @IsNumber()
  playerId: number;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  radius: number;

  @IsObject()
  velocity: {
    x: number;
    y: number;
  };
}
