import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { ElectionModule } from './election/election.module';
import { CandidateModule } from './candidate/candidate.module';
import { VotesModule } from './votes/votes.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [UsersModule, AuthModule, NatsModule, ElectionModule, CandidateModule, VotesModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
