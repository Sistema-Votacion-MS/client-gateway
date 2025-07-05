import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ElectionStatus } from '../enum/election.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ElectionPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ElectionStatus, {
    message: `Valid status are ${ElectionStatus.PENDING}, ${ElectionStatus.OPEN}, ${ElectionStatus.CALCULATING}, ${ElectionStatus.COMPLETED}`,
  })
  @ApiProperty({
    description: 'Filter elections by status',
    enum: ElectionStatus,
    required: false,
    example: ElectionStatus.PENDING,
  })
  status: ElectionStatus;
}