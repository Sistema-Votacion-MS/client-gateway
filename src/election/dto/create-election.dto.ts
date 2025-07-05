import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ElectionStatus } from "../enum/election.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateElectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the election',
    example: 'Presidential Election 2024',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'A brief description of the election',
    example: 'Election for the next president of the country.',
  })
  description: string;

  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    description: 'The start date of the election',
    type: Date,
    example: '2024-01-01T00:00:00Z',
  })
  start_date: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({
    description: 'The end date of the election',
    type: Date,
    example: '2024-01-31T23:59:59Z',
  })
  end_date: Date;

  @IsNotEmpty()
  @IsEnum(ElectionStatus)
  @ApiProperty({
    description: 'The status of the election',
    enum: ElectionStatus,
    example: ElectionStatus.PENDING,
  })
  status: ElectionStatus;
}
