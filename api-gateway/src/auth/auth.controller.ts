import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from './auth.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthContrller {
  public svc: AuthServiceClient;

  @Inject(AUTH_SERVICE_NAME)
  private readonly clinet: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.clinet.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('signup')
  private async signup(
    @Body() body: SignupRequest,
  ): Promise<Observable<SignupResponse>> {
    return this.svc.signup(body);
  }

  @Post('login')
  private async login(
    @Body() body: LoginRequest,
  ): Promise<Observable<LoginResponse>> {
    return this.login(body);
  }
}
