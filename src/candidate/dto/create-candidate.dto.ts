import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the candidate',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The UUID of the election this candidate belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  election_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The political party of the candidate',
    example: 'Democratic Party',
  })
  party: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'URL of the candidate image',
    example: 'https://example.com/candidate-photo.jpg',
  })
  image_url: string;
}
