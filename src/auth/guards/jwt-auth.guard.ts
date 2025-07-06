import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { envs } from 'src/config/envs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger('JwtAuthGuard');

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Route is public, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    console.log('Token extracted from header:', token);

    if (!token) {
      this.logger.warn('No token provided in request');
      throw new UnauthorizedException('Token required');
    }

    try {
      console.log('JWT Secret being used:', envs.jwtSecret);
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: envs.jwtSecret,
      });

      console.log('Payload extracted from token:', payload);

      // Agregar el usuario al request para uso posterior
      request['user'] = payload;

      this.logger.debug(`Token validated for user: ${payload.id} with role: ${payload.role}`);
      return true;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
