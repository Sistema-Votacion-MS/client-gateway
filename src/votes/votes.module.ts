import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [VotesController],
  imports: [NatsModule],
})
export class VotesModule {}
