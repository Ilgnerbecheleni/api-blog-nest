import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BadRequestException } from '@nestjs/common';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService, PrismaService],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        conteudo: 'Conteúdo do post',
        authorId: 1,
      };

      const expectedResult = { id: 1, conteudo: 'Conteúdo do post', authorId: 1 };

      // Mock the create method of the postService
      jest.spyOn(postService, 'create').mockResolvedValueOnce(expectedResult);

      const result = await postController.create(createPostDto);

      expect(result).toEqual(expectedResult);
    });
  });

  // Add tests for other methods (findAll, findOne, update, remove) as needed
});
