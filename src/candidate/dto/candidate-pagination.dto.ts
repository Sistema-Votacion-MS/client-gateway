import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CandidatePaginationDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filter candidates by election ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  election_id?: string;
}
