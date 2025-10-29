import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: [{ type: String, enum: Role }], default: [Role.USER] })
  role: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
