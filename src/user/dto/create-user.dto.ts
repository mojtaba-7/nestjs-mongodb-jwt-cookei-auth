import { MaxLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(11)
  readonly phoneNumber: string;
}

export class AuthUserDto {
  @MaxLength(11)
  readonly phoneNumber: string;

  readonly code: number;
}