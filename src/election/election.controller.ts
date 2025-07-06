import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { ElectionPaginationDto } from './dto/election-pagination.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('election')
@ApiTags('Elections')
export class ElectionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @ApiOperation({ summary: 'Create Election' })
  @ApiBody({
    type: CreateElectionDto,
    description: 'Create a new election',
  })
  create(@Body() createElectionDto: CreateElectionDto) {
    return this.client.send({ cmd: 'election_create' }, createElectionDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() electionPaginationDto: ElectionPaginationDto) {
    return this.client.send({ cmd: 'election_find_all' }, electionPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'election_find_one' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateElectionDto: UpdateElectionDto) {
    return this.client.send({ cmd: 'election_update' }, { id, ...updateElectionDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'election_delete' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id/voters/:uid')
  veryfyVoter(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('uid', ParseUUIDPipe) uid: string,
  ) {
    return this.client.send({ cmd: 'voter_verify' }, { electionId: id, userId: uid }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
