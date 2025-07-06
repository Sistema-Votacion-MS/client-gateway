import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_SERVICE } from 'src/config/services';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/dto/role.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersClient: ClientProxy
  ) { }

  @Post()
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden crear usuarios manualmente
  @ApiOperation({ summary: 'Create User - Admin Only' })
  createUser(@Body() createUserDto: any, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} creating user:`, createUserDto);
    return 'User created successfully';
  }

  @Get()
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden ver todos los usuarios
  @ApiOperation({ summary: 'Get All Users - Admin Only' })
  findAllUsers(@Query() paginationDto: PaginationDto, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} accessing all users`);
    return this.usersClient.send({ cmd: 'find_all_users' }, paginationDto);
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.VOTER) // Administradores y usuarios autenticados
  @ApiOperation({ summary: 'Get User by ID - Admin or Own Profile' })
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    // Los votantes solo pueden ver su propio perfil
    if (user.role === 'VOTER' && user.id !== id.toString()) {
      throw new RpcException({
        status: 403,
        message: 'Voters can only access their own profile',
        error: 'Forbidden',
      });
    }

    console.log(`User ${user.id} (${user.role}) accessing user profile ${id}`);
    try {
      const product = await firstValueFrom(
        this.usersClient.send({ cmd: 'find_one_user' }, { id })
      )

      return product;

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN) // Solo administradores pueden eliminar usuarios
  @ApiOperation({ summary: 'Delete User - Admin Only' })
  deleteUser(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    console.log(`Admin ${user.id} deleting user ${id}`);
    return 'User details for the given ID';
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.VOTER) // Administradores y el propio usuario
  @ApiOperation({ summary: 'Update User - Admin or Own Profile' })
  patchUser(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: JwtPayload
  ) {
    // Los votantes solo pueden actualizar su propio perfil
    if (user.role === 'VOTER' && user.id !== id) {
      throw new RpcException({
        status: 403,
        message: 'Voters can only update their own profile',
        error: 'Forbidden',
      });
    }

    console.log(`User ${user.id} (${user.role}) updating user ${id}:`, body);
    return 'User details for the given ID';
  }
}
