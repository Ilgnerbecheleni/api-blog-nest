/* eslint-disable prettier/prettier */
import {  BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IdToNumberPipe implements PipeTransform {
  transform(value: string):number {
  const id = parseInt(value,10);
  if(isNaN(id)|| id<=0){
    throw new BadRequestException("Id inválido");
  }


  return id ;
  }
}
