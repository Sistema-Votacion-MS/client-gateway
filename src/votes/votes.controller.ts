import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';
import { CreateVotesDto } from './dto/create-votes.dto';

@Controller('votes')
export class VotesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  createVote(@Body() createVotesDto: CreateVotesDto) {
    return this.client.send({ cmd: 'votes_create' }, createVotesDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAllVotes() {
    return this.client.send({ cmd: 'votes_find_all' }, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOneVote(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'votes_find_one' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
