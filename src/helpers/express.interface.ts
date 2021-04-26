import { Request } from 'express';
import { User } from 'src/schema/user.model';

export interface IRequest extends Request {
  user: User
}