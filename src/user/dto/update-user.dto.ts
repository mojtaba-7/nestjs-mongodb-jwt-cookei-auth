import { MaxLength } from 'class-validator'

export class UpdateUserDto {
  @MaxLength(11)
  readonly phoneNumber: string;

  readonly authCode: number;

  readonly authCodeExpirely: number;
}