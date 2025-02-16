import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InitGameDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  canvasWidth: number;

  @IsNotEmpty()
  @IsNumber()
  canvasHeight: number;

  @IsNotEmpty()
  @IsString()
  avatar: string;
}
