import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BadRequestException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let prismaService: PrismaService;
  let userService: UserService;
  const created = new Date();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PrismaService, UserService],
    }).compile();

    postService = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        conteudo: 'Conteúdo do post',
        authorId: 1,
      };

      const expectedResult = {
        id: 1,
        conteudo: 'Conteúdo do post',
        authorId: 1,
        created_at: created,
        updated_at: created,
      };

      // Mock the necessary service methods (prisma and userService)
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce({
        id: 1,
        nome: 'User 1',
        biografia: 'teste',
        created_At: created,
        updated_At: created,
        email: 'ilgner@gui',
        dataNascimento: created,
      });
      jest
        .spyOn(prismaService.post, 'create')
        .mockResolvedValueOnce(expectedResult);

      const result = await postService.create(createPostDto);

      expect(result).toEqual(expectedResult);
    });

    it('should handle when user does not exist', async () => {
      const createPostDto: CreatePostDto = {
        conteudo: 'Conteúdo do post',
        authorId: 1,
      };

      // Mock the userService to return null (user does not exist)
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      try {
        await postService.create(createPostDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Usuário não existe');
      }
    });
  });

  // Add tests for other methods (findAll, findOne, update, remove) as needed
});
