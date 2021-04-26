import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, AuthUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { IResponse } from 'src/interfaces/response.interface';
import { User } from 'src/schema/user.model';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  private logger: Logger = new Logger('userController')

  @Post('auth/get-code')
  async getCode(
    @Body() { phoneNumber }: CreateUserDto,
  ): Promise<IResponse> {
    // fetch the user with phoneNumber
    let user: User = (await this.userService.findOne(phoneNumber)) || null;

    // generate the sms code
    const authCode = this.userService.generateRandomCode();

    // check if user has account already
    if (user) {
      user.authCode = authCode;
      user.authCodeExpirely = Date.now() + (60 * 1000); // One Minute
      user.save();
    } else {
      user = await this.userService.create({
        phoneNumber,
        authCode,
        authCodeExpirely: Date.now() + (120 * 1000)
      });
    }

    // TODO: send sms code to user

    return {
      title: "ارسال پیامک انجام شد.",
      content: "پیامکی حاوی کد ورود ارسال شد. لطفا آن را وارد کنید."
    }
  }

  @Post('/auth')
  async create(@Body() authUserDto: AuthUserDto, @Res({ passthrough: true }) response: Response): Promise<IResponse> {
    // populate the authUserDto data
    const { phoneNumber, code } = authUserDto;

    // fetch the user with phoneNumber
    const user: User = await this.userService.findOne(phoneNumber);

    // check if code equals to authCode (in database)
    const isCodeNotEqual = user.authCode !== Number(code);
    const isExpirely = Date.now() > user.authCodeExpirely;
    this.logger.log({ isExpirely });
    if (isExpirely) {
      return {
        title: "انقضای کد.",
        content: "کد وارد شده منقضی شده است. لطفا دوباره تلاش کنید."
      }
    }
    if (isCodeNotEqual) {
      return {
        title: "اشتباه در کد وارد شده.",
        content: "کد وارد شده صحیح نمیباشد. لطفا دوباره تلاش کنید."
      }
    }

    // set the code and expirely to 0
    user.authCode = 0;
    user.authCodeExpirely = 0;
    user.save();

    // create jwt token
    const jwtToken = this.userService.createJwtToken(phoneNumber);
    // set the cookie to client
    response.cookie('token', jwtToken, {
      httpOnly: true,
      sameSite: true
    });

    return {
      title: "ورود موفق.",
      content: "شما وارد شدید."
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
