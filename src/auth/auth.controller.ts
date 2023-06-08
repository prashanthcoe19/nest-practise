import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  Req,
  Res,
  UseGuards,
  InternalServerErrorException,
  ValidationPipe,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) userLoginDto: UserLoginDto, @Req() req: Request) {
    const token = await this.authService.login(userLoginDto);
    return { accessToken: token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile/:id')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    let user = await this.authService.update(req.params.id, updateUserDto);
    return user;
  }
}
