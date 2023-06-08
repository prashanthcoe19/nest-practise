import { IsLowercase, IsNotEmpty, IsBoolean } from 'class-validator';
/**
 * user login data transfer object
 */
export class UserLoginDto {
  @IsNotEmpty()
  @IsLowercase()
  email: string;

  @IsNotEmpty()
  password: string;
}
