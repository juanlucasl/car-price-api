import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  /**
   * Creates a new user with the given details.
   *
   * @param email - User email.
   * @param password - User password.
   */
  create(email: string, password: string) {
    const user = this.repository.create({ email, password });

    return this.repository.save(user);
  }

  /**
   * Find a user given their id.
   *
   * @param id - ID to look for.
   * @returns User with matching id.
   *
   * @throws {NotFoundException}
   * Thrown if a user with the given ID isn't found.
   */
  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Find all users associated to a given email address.
   *
   * @param email - Email address to look for.
   * @returns Array of matching users.
   */
  find(email: string) {
    return this.repository.findBy({ email });
  }

  /**
   * Update a user with a given id.
   *
   * @param id - User id.
   * @param attrs - User attributes to update.
   * @returns Updated user.
   *
   * @throws {NotFoundException}
   * Thrown if a user with the given email isn't found.
   */
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  /**
   * Remove a user with a given id.
   *
   * @param id - Id of the user to remove.
   * @returns Removed user.
   *
   * @throws {NotFoundException}
   * Thrown if a user with the given ID isn't found.
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repository.remove(user);
  }
}
