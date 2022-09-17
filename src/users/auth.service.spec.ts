import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a mock copy of the users service.
    const users: User[] = [];
    mockUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.ceil(Math.random() * 100000), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const mockPassword = 'mockPassword';
    const user = await authService.signup('dummy@email.com', mockPassword);

    // Check that the password isn't in plain text.
    expect(user.password).not.toEqual(mockPassword);

    // Check that the password is salted and hashed.
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if a user tries to sign up with an email that is already in use', async () => {
    const mockMail = 'mock@mail.com';

    await authService.signup(mockMail, 'dummy');

    await expect(authService.signup(mockMail, 'dummy')).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      authService.signin('dummy@mail.com', 'dummy'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('throws an error if a wrong password is provided', async () => {
    const mockMail = 'mock@mail.com';

    await authService.signup(mockMail, 'dummy');

    await expect(
      authService.signin(mockMail, 'wrongPassword'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('returns a user if a correct password is provided', async () => {
    const mockMail = 'mock@mail.com';
    const mockPassword = 'mockPassword';

    await authService.signup(mockMail, mockPassword);

    const user = await authService.signin(mockMail, mockPassword);
    expect(user).toBeDefined();
  });
});
