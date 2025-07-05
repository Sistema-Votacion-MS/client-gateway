import { Module } from '@nestjs/common';
import { ElectionController } from './election.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ElectionController],
  imports: [NatsModule],
})
export class ElectionModule {}
