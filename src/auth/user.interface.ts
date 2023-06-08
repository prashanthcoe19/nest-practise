import { User as UserSchema } from './auth.model';

export interface UserWithId extends UserSchema {
  _id: string;
}
