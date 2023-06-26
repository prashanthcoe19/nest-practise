import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }
  validate(@Req() req: Request, payload: any) {
    console.log('here');
    const refreshToken = req?.header('authorization')?.replace('Bearer','').trim();
    console.log(refreshToken);
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    const tokenId = req?.header('token-id')
    return this.authService.checkIfRefreshTokenMatches(refreshToken,tokenId,payload )
  }
}
