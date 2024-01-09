import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => Promise.resolve({ id, email: 'abc@example.com', password: 'abcd' } as User),
      findAll: (email: string) => Promise.resolve([{ id: 1, email, password: '1234' } as User]),
      // update: () => {},
      // remove: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser gives a list of user with given email', async () => {
    const users = await controller.findAllUser('abc@example.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('abc@example.com');
  });

  it('findUser give a user with given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('singin updates session and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin({ email: 'abc@gmail.com', password: '1234' }, session);

    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
