/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { requestUserDTO } from './dto/request-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<requestUserDTO> {
    try {
    
      if (!email) {
        throw new BadRequestException('E-mail invalido');
      }
      const user: requestUserDTO = await this.prisma.user.findFirst({
        where: { email: email },
        select: {
          id: true,
          nome: true,
          email: true,
          dataNascimento: true,
          biografia: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Not Found');
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { nome, email, dataNascimento, biografia } = createUserDto;
      const verify = await this.findByEmail(email);

      if (verify) {
        throw new BadRequestException('Email already exist');
      }

      const user = await this.prisma.user.create({
        data: {
          nome,
          email,
          dataNascimento,
          biografia,
        },
        select: {
          id: true,
          nome: true,
        },
      });
      return {
        status: 'Cadastrado com Sucesso',
        message: user,
      };
    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao cadastrar usuario',
        message: err.message,
      });
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          nome: true,
          dataNascimento: true,
          biografia: true,
        },
      });
      if (users.length != 0){
        return users;
      }else {
        return {
          message: 'sem usuários cadastrados'
        }
      }
    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao buscar usuario',
        message: err.message,
      });
    }
  }

 async  findOne(id: number) {
  try {
    const user = await this.prisma.user.findFirst({
      where: { id },
       select: {
        id: true,
        nome: true,
        email: true,
        dataNascimento:true,
        biografia:true,
        created_At:true,
        updated_At:true
      }
    });
    if (user){
      return user;
    }else {
     throw  new BadRequestException("usuário não encontrado!");
    }



  } catch (err) {
    throw new BadRequestException({
      status: 'Falha ao buscar usuario',
      message: err.message,
    })
  }  


  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const {  nome,  dataNascimento, biografia } = updateUserDto;
     
      const user = await this.prisma.user.update({ where: { id: id }, data: { nome, dataNascimento, biografia } });
      return user;

    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao atualizar usuario',
        message: err.message,
      })
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);
  
      if (user) {
        await this.prisma.user.delete({
          where: {
            id: id,
          },
        });
  
        return {
          message: `Usuário com ID ${id} deletado com sucesso!`,
        };
      } else {
        return {
          message: `Usuário com ID ${id} não encontrado.`,
        };
      }
    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao deletar usuario',
        message: err.message,
      },)
  }

}

}