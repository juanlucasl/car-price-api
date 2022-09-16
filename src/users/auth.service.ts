import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * Creates a new user with the given details. The password is salted and
   * hashed in the process.
   *
   * @param email - Email for the new user
   * @param password - Password for the new user
   */
  async signup(email: string, password: string) {
    // See if email is in use.
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email already in use');

    // Generate a salt.
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and password together.
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and salt together.
    const saltedHash = `${salt}.${hash.toString('hex')}`;

    // Create a new user and return it.
    return await this.usersService.create(email, saltedHash);
  }

  /**
   * Returns a user with a given email and password.
   *
   * @param email - Email to look for.
   * @param password - User-entered password.
   * @returns The retrieved user.
   *
   * @throws {NotFoundException}
   * Thrown if a user with the given email isn't found.
   *
   * @throws {BadRequestException}
   * Thrown if a user with the given email is found, but the entered password
   * doesn't match.
   */
  async signin(email: string, password: string) {
    // Find a user with the given email.
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException('User not found');

    // Get user's salt and password.
    const [salt, storedHash] = user.password.split('.');

    // Hash the salt and password input together.
    const calculatedHash = (await scrypt(password, salt, 32)) as Buffer;

    // If the stored hash is different to the newly calculated hash, throw an error.
    if (storedHash !== calculatedHash.toString('hex'))
      throw new BadRequestException('Bad password');

    // Return the user.
    return user;
  }
}
