import { IsNumber, IsString } from 'class-validator';

export class InitGameDto {
  @IsString()
  name: string;

  @IsNumber()
  canvasWidth: number;

  @IsNumber()
  canvasHeight: number;
}
