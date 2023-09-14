/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class requestUserDTO extends PartialType(CreateUserDto) {
  readonly id: number; 
}
