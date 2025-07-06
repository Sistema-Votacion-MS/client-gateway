import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { ElectionModule } from './election/election.module';
import { CandidateModule } from './candidate/candidate.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [/* UsersModule,  */AuthModule, NatsModule, ElectionModule, CandidateModule, VotesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
