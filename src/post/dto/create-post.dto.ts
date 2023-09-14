import { IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly conteudo: string;

  @IsInt()
  readonly authorId: number;
}
