import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [/* UsersModule,  */AuthModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
