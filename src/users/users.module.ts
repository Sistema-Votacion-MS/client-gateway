import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServers,
        },
      },
    ]),
  ]
})
export class UsersModule { }
