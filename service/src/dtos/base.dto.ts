import { IsUUID, IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty({
    nullable: false,
    required: true,
    description: 'Entity unique identifier',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    nullable: false,
    description: 'Date of creation',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDefined()
  @IsString()
  public createdAt: string;

  @ApiProperty({
    nullable: false,
    description: 'Date of update',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDefined()
  @IsString()
  public updatedAt: string;
}

export class BaseResponseDto {
  @ApiProperty({
    nullable: false,
    required: true,
    description: 'Entity unique identifier',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsString()
  id: string;
}
