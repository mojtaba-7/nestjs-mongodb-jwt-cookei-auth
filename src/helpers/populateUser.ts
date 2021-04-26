import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { IRequest } from './express.interface';

export class PopulateUser {
  constructor(private userService: UserService) { }
  populateUserCookie = async (req: IRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
      next();
      return;
    }
    try {
      const tokenObj = verify(token, 'hard!to-guess_secret');
      const phoneNumber = tokenObj['phoneNumber'];
      const user = await this.userService.findOne(phoneNumber);
      req.user = user;
    } catch (error) {
      res.status(401).json({
        title: "JWT اشتباه است.",
        content: "کاربری با این کوکی پیدا نشد."
      });
      return;
    }

    next();
  }
}