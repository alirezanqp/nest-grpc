import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  LoginResponse,
  SignupResponse,
  ValidateResponse,
} from './auth.pb';
import {
  LoginRequestDto,
  SignupRequestDto,
  ValidateRequestDto,
} from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'signup')
  private signup(payload: SignupRequestDto): Promise<SignupResponse> {
    return this.authService.signup(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'login')
  private login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.authService.login(payload);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'validate')
  private validate(payload: ValidateRequestDto): Promise<ValidateResponse> {
    return this.authService.validate(payload);
  }
}
