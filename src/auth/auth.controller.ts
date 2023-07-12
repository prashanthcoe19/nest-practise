import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './refresh-token.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/current-user';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiResponse
} from '@nestjs/swagger';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserWithId } from './user.interface';

@ApiTags('user')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({description: 'User Register'})
  @ApiBody({type: CreateUserDto})
  register(@Body() createUserDto: CreateUserDto): Promise<UserWithId> {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  @ApiOkResponse({description: 'User Login'})
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials'})
  @ApiBody({type: UserLoginDto})
  async login(@Body(ValidationPipe) userLoginDto: UserLoginDto, @Req() req: Request) {
    const token = await this.authService.login(userLoginDto);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiBearerAuth()
  @ApiResponse({status: 200, type: UserProfileDto})
  async profile(@Req() req: Request, @CurrentUser() userId: string):Promise<UserWithId> {
    // const user = instanceToPlain(req.user,{excludePrefixes:['password']});
    return await this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('/profile/:id')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    let user = await this.authService.update(req.params.id, updateUserDto);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @Get('refresh')
  async refreshToken(@Req() req: Request){
    console.log(req);
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: Request){
    const refreshToken = req?.header('authorization')?.replace('Bearer','').trim();
    await this.authService.revokeRefreshToken(refreshToken);
  }
}
