import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  email: string;
}
