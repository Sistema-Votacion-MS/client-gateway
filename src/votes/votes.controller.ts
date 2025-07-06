import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';
import { CreateVotesDto } from './dto/create-votes.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/dto/role.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('votes')
@ApiTags('Votes')
@ApiBearerAuth('JWT-auth')
export class VotesController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  @Roles(RoleEnum.VOTER) // Solo votantes pueden votar
  @ApiOperation({ summary: 'Create Vote - Voter Only' })
  @ApiBody({ type: CreateVotesDto, description: 'Vote data' })
  createVote(@Body() createVotesDto: CreateVotesDto, @CurrentUser() user: JwtPayload) {
    // Verificar que el votante solo pueda votar por sí mismo
    if (createVotesDto.user_id !== user.id) {
      throw new RpcException({
        status: 403,
        message: 'Voters can only vote for themselves',
        error: 'Forbidden',
      });
    }

    console.log(`Voter ${user.id} casting vote:`, createVotesDto);
    return this.client.send({ cmd: 'votes_create' }, createVotesDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden ver todos los votos
  @ApiOperation({ summary: 'Get All Votes - Admin Only' })
  findAllVotes(@CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} accessing all votes`);
    return this.client.send({ cmd: 'votes_find_all' }, {}).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden ver votos específicos
  @ApiOperation({ summary: 'Get Vote by ID - Admin Only' })
  findOneVote(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} accessing vote ${id}`);
    return this.client.send({ cmd: 'votes_find_one' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}
