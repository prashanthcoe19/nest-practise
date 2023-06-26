import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './auth.model';
import { RefreshTokenSchema } from './token.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { APP_PIPE } from '@nestjs/core';
import { CustomValidationPipe } from '../common/pipes/custom-validation.pipe';
import { RTStrategy } from './refreshToken.strategy';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{name:'RefreshToken', schema: RefreshTokenSchema}]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: ()=>({
        secret: jwtConstants.secret,
        signOptions: {
          expiresIn: '10min'
        }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RTStrategy,{
    provide: APP_PIPE,
    useClass: CustomValidationPipe
  }],
})
export class AuthModule {}
