import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { NATS_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.client.send({ cmd: 'auth_register' }, registerDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  login(@Body() LoginDto: LoginDto) {
    return this.client.send({ cmd: 'auth_login' }, LoginDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
