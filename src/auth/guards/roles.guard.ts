import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleEnum } from '../dto/role.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger('RolesGuard');

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se especifican roles, permitir acceso
    if (!requiredRoles) {
      this.logger.debug('No roles required, allowing access');
      return true;
    }

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('No user found in request');
      throw new ForbiddenException('User not found');
    }

    const hasRole = requiredRoles.some(role => role.toString() === user.role);

    if (!hasRole) {
      this.logger.warn(`User ${user.id} with role ${user.role} attempted to access endpoint requiring roles: ${requiredRoles.join(', ')}`);
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.debug(`User ${user.id} with role ${user.role} granted access`);
    return true;
  }
}
