import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [CandidateController],
  imports: [NatsModule],
})
export class CandidateModule { }
