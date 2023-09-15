

export class requestUserDTO  {
  id:number;
  nome: string;
  readonly email: string;
  readonly dataNascimento: Date;
  readonly biografia: string | null;
  readonly created_At: Date;
  readonly updated_At: Date;
}
