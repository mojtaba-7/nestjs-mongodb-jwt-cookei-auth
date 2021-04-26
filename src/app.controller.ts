import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { IRequest } from './helpers/express.interface';
import { User } from './schema/user.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: IRequest): User {
    return req.user;
  }
}
