/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userPrisma: UserService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const { conteudo , authorId} = createPostDto;
      const verify = await this.userPrisma.findOne(authorId);
      if (!verify) {
        throw new BadRequestException('Usuário não existe');
      }
      const post = await this.prisma.post.create({
        data: {
          conteudo,
          authorId
        }
      });
      return post;

    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao buscar usuario',
        message: err.message,
      });
    }
  }

  async findAll() {
    try {
      const posts = await this.prisma.post.findMany();
      if (posts.length != 0){
        return posts;
      }else {
        return {
          message: 'sem posts publicados'
        }
      }
    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao buscar posts',
        message: err.message,
      });
    }
  }


  async  findOne(id: number) {
    try {
      const post = await this.prisma.post.findFirst({where: { id }});
      if (post){
        return post;
      }else {
       throw  new BadRequestException("post não encontrado!");
      }
    } catch (err) {
      throw new BadRequestException({
        status: 'Falha ao buscar post',
        message: err.message,
      })
    }  
  
  
    }


    async update(id: number, updatePostDto: UpdatePostDto) {
      try {
        const {  conteudo } = updatePostDto;
       
        const post = await this.prisma.post.update({ where: { id: id }, data: { conteudo} });
        return post;
  
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
          await this.prisma.post.delete({
            where: {
              id: id,
            },
          });
    
          return {
            message: `Post com ID ${id} deletado com sucesso!`,
          };
        } else {
          return {
            message: `Post com ID ${id} não encontrado.`,
          };
        }
      } catch (err) {
        throw new BadRequestException({
          status: 'Falha ao deletar Post',
          message: err.message,
        },)
    }
  
  }
}
