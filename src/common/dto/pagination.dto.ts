import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
    required: false,
  })
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    description: 'The number of items per page for pagination',
    example: 10,
    required: false,
  })
  limit?: number = 10;
}