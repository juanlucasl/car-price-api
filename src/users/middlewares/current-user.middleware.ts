import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    // Take the value of the session cookie in the incoming request (if there is such cookie).
    const { userId } = request.session || {};

    if (userId) {
      // Get the user that matches the userId in the session cookie.
      request.currentUser = await this.usersService.findOne(userId);
    }

    next();
  }
}
