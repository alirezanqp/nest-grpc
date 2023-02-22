import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from '../entity/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'auth-svc',
      ignoreExpiration: true,
    });
  }

  async validate(auth: Auth): Promise<Auth | never> {
    return await this.authService.validateUser(auth);
  }
}
