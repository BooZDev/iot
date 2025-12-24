import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: Date, required: true })
  dateOfBirth: Date;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: false })
  avatarUrl: string;

  @Prop({ type: [{ type: String, enum: Role }], default: [Role.STAFF] })
  role: Role[];

  @Prop({ type: Types.ObjectId, default: false })
  warehouseId: Types.ObjectId;

  @Prop({ type: String, default: null })
  hashedRefreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
