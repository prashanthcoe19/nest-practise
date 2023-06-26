import { IsLowercase, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
/**
 * user login data transfer object
 */
export class UserLoginDto {
  @IsNotEmpty()
  @IsLowercase()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
