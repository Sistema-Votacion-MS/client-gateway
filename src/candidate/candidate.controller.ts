import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CandidatePaginationDto } from './dto/candidate-pagination.dto';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/dto/role.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('candidate')
@ApiTags('Candidates')
@ApiBearerAuth('JWT-auth')
export class CandidateController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden crear candidatos
  @ApiOperation({ summary: 'Create Candidate - Admin Only' })
  @ApiBody({
    type: CreateCandidateDto,
    description: 'Create a new candidate for an election',
  })
  create(@Body() createCandidateDto: CreateCandidateDto, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} creating candidate:`, createCandidateDto);
    return this.client.send({ cmd: 'candidate_create' }, createCandidateDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  @Public() // Información pública de candidatos
  @ApiOperation({ summary: 'Get all candidates - Public' })
  findAll(@Query() candidatePaginationDto: CandidatePaginationDto) {
    return this.client.send({ cmd: 'candidate_find_all' }, candidatePaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  @Public() // Información pública de candidatos individuales
  @ApiOperation({ summary: 'Get candidate by ID - Public' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'candidate_find_one' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden actualizar candidatos
  @ApiOperation({ summary: 'Update candidate - Admin Only' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCandidateDto: UpdateCandidateDto, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} updating candidate ${id}:`, updateCandidateDto);
    return this.client.send({ cmd: 'candidate_update' }, { id, ...updateCandidateDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden eliminar candidatos
  @ApiOperation({ summary: 'Delete candidate - Admin Only' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} deleting candidate ${id}`);
    return this.client.send({ cmd: 'candidate_delete' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
