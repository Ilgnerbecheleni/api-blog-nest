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

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
