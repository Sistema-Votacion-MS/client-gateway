import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { NatsModule } from 'src/transports/nats.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { envs } from 'src/config/envs';

@Module({
  controllers: [AuthController],
  providers: [JwtAuthGuard, RolesGuard],
  imports: [
    NatsModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule { }
