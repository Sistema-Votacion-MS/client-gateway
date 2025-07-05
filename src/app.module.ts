import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { ElectionModule } from './election/election.module';

@Module({
  imports: [/* UsersModule,  */AuthModule, NatsModule, ElectionModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
