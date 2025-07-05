import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_SERVICE } from 'src/config/services';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersClient: ClientProxy
  ) { }

  @Post()
  createUser() {
    return 'User created successfully';
  }

  @Get()
  findAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersClient.send({ cmd: 'find_all_users' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
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
  deleteUser(@Param('id') id: string) {
    return 'User details for the given ID';
  }

  @Patch(':id')
  patchUser(
    @Param('id') id: string,
    @Body() body: any
  ) {
    return 'User details for the given ID';
  }
}
