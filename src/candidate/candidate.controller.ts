import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CandidatePaginationDto } from './dto/candidate-pagination.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('candidate')
@ApiTags('Candidates')
export class CandidateController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @ApiOperation({ summary: 'Create Candidate' })
  @ApiBody({
    type: CreateCandidateDto,
    description: 'Create a new candidate for an election',
  })
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.client.send({ cmd: 'candidate_create' }, createCandidateDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all candidates' })
  findAll(@Query() candidatePaginationDto: CandidatePaginationDto) {
    return this.client.send({ cmd: 'candidate_find_all' }, candidatePaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get candidate by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'candidate_find_one' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update candidate' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    return this.client.send({ cmd: 'candidate_update' }, { id, ...updateCandidateDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete candidate' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'candidate_delete' }, id).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
