import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Creates a new user with the given details.
   *
   * @param body - User email and password.
   * @param session - Session object.
   * @returns New user.
   */
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  /**
   * Signs in the user with the given email if the password is correct.
   *
   * @param body - User email and password.
   * @param session - Session object.
   * @returns Signed user.
   */
  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  /**
   * Signs out a user.
   *
   * @param session - Session object.
   */
  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }

  /**
   * Returns a signed-in user's email and id.
   *
   * @param user - Signed-in user.
   * @returns Signed user.
   */
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  /**
   * Find a user given their id.
   *
   * @param id - ID to look for.
   * @returns User with matching id.
   */
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  /**
   * Find all users associated to a given email address.
   *
   * @param email - Email address to look for.
   * @returns Array of matching users.
   */
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  /**
   * Update a user with a given id.
   *
   * @param id - User id.
   * @param body - User attributes to update.
   * @returns Updated user.
   */
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  /**
   * Remove a user with a given id.
   *
   * @param id - ID of the user to remove.
   * @returns Removed user.
   */
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
