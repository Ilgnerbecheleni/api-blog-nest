import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { requestUserDTO } from './dto/request-user.dto';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  const created = new Date();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'John Doe',
        email: 'johndoe@example.com',
        dataNascimento: new Date(),
        biografia: 'Test bio',
      };
      const expectedResult = {
        status: 'Cadastrado com Sucesso',
        message: {
          id: 1,
          nome: 'Nome do Usuário',
        },
      };

      // Mock Prisma and findByEmail
      jest.spyOn(userService, 'create').mockResolvedValueOnce(expectedResult);
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(expectedResult);
    });

    it('should handle when user email already exists', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'John Doe',
        email: 'johndoe@example.com',
        dataNascimento: created,
        biografia: 'Test bio',
      };

      // Mock Prisma and findByEmail to return an existing user
      jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce({
        nome: 'John Doe',
        email: 'johndoe@example.com',
        dataNascimento: created,
        biografia: 'Test bio',
        created_At: created,
        updated_At: created,
      });
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce({
        id: 1,
        nome: 'John Doe',
        email: 'johndoe@example.com',
        dataNascimento: new Date(),
        biografia: 'Test bio',
        created_At: created,
        updated_At: created,
      });

      try {
        await userService.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Email already exist');
      }
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const expectedUsers: requestUserDTO[] = [
        {
          id: 1,
          nome: 'User 1',
          email: 'user1@example.com',
          dataNascimento: new Date(),
          biografia: 'Bio 1',
          created_At: created,
          updated_At: created,
        },
        {
          id: 2,
          nome: 'User 2',
          email: 'user2@example.com',
          dataNascimento: new Date(),
          biografia: 'Bio 2',
          created_At: created,
          updated_At: created,
        },
      ];

      jest
        .spyOn(prismaService.user, 'findMany')
        .mockResolvedValueOnce(expectedUsers);

      const result = await userService.findAll();

      expect(result).toEqual(expectedUsers);
    });

    it('should handle when no users are found', async () => {
      // Mock Prisma to return an empty array
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValueOnce([]);

      const result = await userService.findAll();

      expect(result).toEqual({ message: 'sem usuários cadastrados' });
    });
  });

  // Add more test cases for other methods (findOne, update, remove) as needed
});
