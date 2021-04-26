import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { PopulateUser } from './helpers/populateUser';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  const userService = app.get(UserService);
  const populateUser = new PopulateUser(userService);

  app.use(populateUser.populateUserCookie);

  app.setGlobalPrefix('api');
  await app.listen(5000);
}
bootstrap();
