import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      // Create fake method of user service
      findAll: (email: string) => {
        const user = users.filter((user) => (user.email = email));

        return Promise.resolve(user);
      },
      create: (email: string, password: string) => {
        const user = { id: users.length, email, password } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };

    // Create moduel
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService); // Create a new instance of AuthService
  });

  it('Can create instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('Create an user with a salted and hashed password: signup successfully', async () => {
    const user = await service.signup('abce@gmail.com', 'abcd');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('abcd');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use: signup is failed', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  });

  it('Throw an error if email does not exist: singin is failed', async () => {
    await expect(service.signin('abcd@gmail.com', 'abcd')).rejects.toThrow(NotFoundException);
  });

  it('Throw an error if password is not correct: singin is failed', async () => {
    await service.signup('abcd@gmail.com', 'abcd');
    await expect(service.signin('abcd@gmail.com', 'abcde4')).rejects.toThrow(BadRequestException);
  });

  it('Return an user if the password is correct: singin successfully', async () => {
    await service.signup('abc@gmail.com', 'mypassword');
    const user = await service.signin('abc@gmail.com', 'mypassword');

    expect(user).toBeDefined();
  });
});
