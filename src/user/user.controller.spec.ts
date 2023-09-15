import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { requestUserDTO } from './dto/request-user.dto';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const create = new Date();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
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
        message: { id: 1, nome: 'John Doe' },
      };

      // Mock the createUser method of the userService
      jest.spyOn(userService, 'create').mockResolvedValueOnce(expectedResult);

      const result = await userController.create(createUserDto);

      expect(result).toEqual(expectedResult);
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
          created_At: create,
          updated_At: create,
        },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(expectedUsers);

      const result = await userController.findAll();

      expect(result).toEqual(expectedUsers);
    });

    it('should handle when no users are found', async () => {
      // Mock the findAll method of the userService to return an empty array
      jest
        .spyOn(userService, 'findAll')
        .mockResolvedValueOnce({ message: 'sem usuários cadastrados' });

      const result = await userController.findAll();

      expect(result).toEqual({ message: 'sem usuários cadastrados' });
    });
  });

  // Add more test cases for other methods (findOne, update, remove) as needed
});
