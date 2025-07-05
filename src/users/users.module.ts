import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [NatsModule]
})
export class UsersModule { }
