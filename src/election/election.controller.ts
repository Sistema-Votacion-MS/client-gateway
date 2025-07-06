import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';
import { ElectionPaginationDto } from './dto/election-pagination.dto';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/dto/role.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('election')
@ApiTags('Elections')
@ApiBearerAuth('JWT-auth')
export class ElectionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden crear elecciones
  @ApiOperation({ summary: 'Create Election - Admin Only' })
  @ApiBody({
    type: CreateElectionDto,
    description: 'Create a new election',
  })
  create(@Body() createElectionDto: CreateElectionDto, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} creating election:`, createElectionDto);
    return this.client.send({ cmd: 'election_create' }, createElectionDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  @Public() // Cualquier persona puede ver las elecciones disponibles
  @ApiOperation({ summary: 'Get All Elections - Public' })
  findAll(@Query() electionPaginationDto: ElectionPaginationDto) {
    return this.client.send({ cmd: 'election_find_all' }, electionPaginationDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  @Public() // Información pública de elecciones
  @ApiOperation({ summary: 'Get Election by ID - Public' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'election_find_one' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Put(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden actualizar elecciones
  @ApiOperation({ summary: 'Update Election - Admin Only' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateElectionDto: UpdateElectionDto, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} updating election ${id}:`, updateElectionDto);
    return this.client.send({ cmd: 'election_update' }, { id, ...updateElectionDto }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden eliminar elecciones
  @ApiOperation({ summary: 'Delete Election - Admin Only' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} deleting election ${id}`);
    return this.client.send({ cmd: 'election_delete' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id/voters/:uid')
  @Roles(RoleEnum.ADMIN, RoleEnum.VOTER) // Administradores y votantes autenticados pueden verificar
  @ApiOperation({ summary: 'Verify Voter - Admin or Authenticated Voter' })
  veryfyVoter(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('uid', ParseUUIDPipe) uid: string,
    @CurrentUser() user: JwtPayload
  ) {
    // Los votantes solo pueden verificar su propio estado
    if (user.role === 'VOTER' && user.id !== uid) {
      throw new RpcException({
        status: 403,
        message: 'Voters can only check their own voting status',
        error: 'Forbidden',
      });
    }

    console.log(`User ${user.id} (${user.role}) checking voter status for user ${uid} in election ${id}`);
    return this.client.send({ cmd: 'voter_verify' }, { election_id: id, user_id: uid }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
      map((response) => {
        if (!response) {
          throw new RpcException({
            status: 404,
            message: `Voter with user_id ${uid} not found in election ${id}`,
            error: 'Voter Not Found',
          });
        }
        return response;
      }),
    );
  }
}
