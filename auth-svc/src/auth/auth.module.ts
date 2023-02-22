import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy/auth.startegy';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from './entity/auth.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'auth-svc',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([Auth]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
