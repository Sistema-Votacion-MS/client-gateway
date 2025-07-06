import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { NATS_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'User registration data' })
  register(@Body() registerDto: RegisterDto) {
    console.log('Registering user:', registerDto);
    return this.client.send({ cmd: 'auth_registe' }, registerDto).pipe(
      catchError((error) => {
        console.error('Error during registration:', error);
        throw new RpcException(error);
      }),
    );
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  login(@Body() LoginDto: LoginDto) {
    return this.client.send({ cmd: 'auth_login' }, LoginDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
