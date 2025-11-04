import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/auth/enums/role.enum';

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

  @Prop({ type: String, default: null })
  hashedRefreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
