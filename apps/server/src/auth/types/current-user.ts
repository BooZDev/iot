import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export type CurrentUser = {
  id: Types.ObjectId;
  role: Role[];
};
