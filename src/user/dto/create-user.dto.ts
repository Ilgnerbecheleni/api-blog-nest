import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsDate, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly nome: string;

  @IsEmail()
  readonly email: string;
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  readonly dataNascimento: Date;

  @IsString()
  @IsOptional()
  readonly biografia: string | null;
}
