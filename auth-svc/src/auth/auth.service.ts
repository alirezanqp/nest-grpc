import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SignupRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from './dto/auth.dto';
import { LoginResponse, SignupResponse, ValidateResponse } from './auth.pb';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  public async signup({
    email,
    password,
  }: SignupRequestDto): Promise<SignupResponse> {
    const auth: Auth = await this.authRepository.findOne({ where: { email } });

    if (auth) {
      return { status: HttpStatus.CONFLICT, errors: ['E-Mail already exists'] };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await this.authRepository.save({
      email,
      password: hashPassword,
    });

    return { status: HttpStatus.CREATED, errors: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const auth: Auth = await this.authRepository.findOne({ where: { email } });

    if (!auth) {
      return {
        status: HttpStatus.NOT_FOUND,
        errors: ['E-Mail not found'],
        token: null,
      };
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      auth.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        errors: ['Password wrong'],
        token: null,
      };
    }

    const token: string = await this.generateToken(auth);

    return { token, status: HttpStatus.OK, errors: null };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: Auth = this.jwtService.decode(token) as Auth;

    if (!decoded) {
      return {
        status: HttpStatus.FORBIDDEN,
        errors: ['Token is invalid'],
        userId: null,
      };
    }

    const auth: Auth = await this.validateUser(decoded);

    if (!auth) {
      return {
        status: HttpStatus.CONFLICT,
        errors: ['User not found'],
        userId: null,
      };
    }

    return { status: HttpStatus.OK, errors: null, userId: decoded.id };
  }

  async generateToken(auth: Auth): Promise<string> {
    return this.jwtService.sign({ id: auth.id, email: auth.email });
  }

  async validateUser(auth: Auth): Promise<Auth> {
    return this.authRepository.findOne({ where: { email: auth.email } });
  }
}
