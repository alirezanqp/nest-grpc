import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateResponse } from './auth.pb';

export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private service: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) throw new UnauthorizedException();

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    const { status, userId }: ValidateResponse = await this.service.validate(
      token,
    );

    req.user = userId;

    if (status !== HttpStatus.OK) throw new UnauthorizedException();

    return true;
  }
}
