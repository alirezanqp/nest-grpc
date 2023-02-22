/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

/** signup messages */
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  status: number;
  errors: string[];
}

/** login messages */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  errors: string[];
  token: string;
}

/** verify */
export interface ValidateRequest {
  token: string;
}

export interface ValidateResponse {
  status: number;
  errors: string[];
  userId: number;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  signup(request: SignupRequest): Observable<SignupResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  validate(request: ValidateRequest): Observable<ValidateResponse>;
}

export interface AuthServiceController {
  signup(request: SignupRequest): Promise<SignupResponse> | Observable<SignupResponse> | SignupResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["signup", "login", "validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
