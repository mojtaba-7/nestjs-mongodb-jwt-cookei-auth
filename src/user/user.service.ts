import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.model';

@Injectable()
export class UserService {
  constructor(
    public readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  createJwtToken(phoneNumber: string): string {
    return this.jwtService.sign({ phoneNumber });
  }

  async create(createUserDto: UpdateUserDto) {
    const newUser = await new this.userModel(createUserDto);
    await newUser.save();
    console.log(createUserDto);
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(phoneNumber: string): Promise<User> {
    const user = await this.userModel.findOne({ phoneNumber });
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  generateRandomCode(): number {
    // 2 minuts time expirely
    const code = Math.ceil(Math.random() * 1e5);
    return code;
  }
}
