import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Creates a new user with the given details.
   *
   * @param body User email and password
   */
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  /**
   * Find a user given their id.
   *
   * @param id Id to look for.
   * @returns User with matching id.
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  /**
   * Find all users associated to a given email address.
   *
   * @param email Email address to look for.
   * @returns Array of matching users.
   */
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  /**
   * Update a user with a given id.
   *
   * @param id User id.
   * @param body User attributes to update.
   * @returns Updated user.
   */
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  /**
   * Remove a user with a given id.
   *
   * @param id Id of the user to remove.
   * @returns Removed user.
   */
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
