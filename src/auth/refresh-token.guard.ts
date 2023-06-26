// import { Injectable, Req } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.log('Request headers:', request.headers); // Logging req.headers

    return super.canActivate(context);
  }
}
