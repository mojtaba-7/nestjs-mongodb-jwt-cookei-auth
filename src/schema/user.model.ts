import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

enum Role {
  USER = "USER",
}

@Schema()
export class User extends Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birth: Date;

  @Prop()
  role: Role;

  @Prop({ unique: true, require: true })
  phoneNumber: string;

  @Prop()
  authCode: number;

  @Prop({ require: true })
  authCodeExpirely: number;

  @Prop({ defaultStatus: ['comment1', 'comment2'] })
  comments: []
}

export const UserSchema = SchemaFactory.createForClass(User);
