import {
  IsArray,
  IsUUID,
  IsString,
  IsDefined,
  IsOptional,
  IsJSON,
  ValidateNested,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';

export class CreateCaseCardDto {
  @ApiProperty({
    description: 'Card name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first card name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Card description',
    nullable: false,
    required: true,
    example: 'My first card description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Serial of the card in the column',
    nullable: false,
    required: true,
    type: Number,
    example: 3,
  })
  @IsDefined()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    description: 'Card progress [0, 100]',
    nullable: false,
    required: true,
    type: Number,
    example: 34,
  })
  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(100)
  public progress: number;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'ID of assigned column',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  public boardColumnId: string;
}

export class UpdateCaseCardDto {
  @ApiProperty({
    description: 'Card name',
    required: false,
    type: String,
    example: 'My first card name',
  })
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Card description',
    required: false,
    example: 'My first card description',
    type: String,
  })
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Serial of the card in the card',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    description: 'Card progress',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  public progress: number;

  @ApiProperty({
    required: false,
    description: 'ID of assigned board',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  public boardColumnId: string;
}

export class BulkUpdateCaseCardDto extends UpdateCaseCardDto {
  @ApiProperty({
    required: false,
    description: 'ID of card',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  readonly id: string;
}

export class CaseCardDto extends BaseDto {
  @ApiProperty({
    description: 'Card name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first card name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Card description',
    nullable: false,
    required: true,
    example: 'My first card description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Sequential number of card in column',
    nullable: false,
    required: true,
    example: 23,
    type: Number,
  })
  @IsDefined()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    description: 'Card progress [0, 100]',
    nullable: false,
    required: true,
    type: Number,
    example: 34,
  })
  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(100)
  public progress: number;

  @ApiProperty({
    description: 'Card metadata - additional card data',
    nullable: true,
    required: false,
    type: Object,
    example: { status: 'active', priority: 'high' },
  })
  @IsOptional()
  @IsJSON()
  public metadata: object;

  @ApiProperty({
    required: false,
    description: 'ID of assigned board',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  public boardColumnId: string;
}

export class AllCaseCardsDto {
  @ApiProperty({
    type: [CaseCardDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseCardDto)
  public items: CaseCardDto[];

  @ApiProperty({
    description: 'Number of items',
    nullable: false,
    required: true,
    type: Number,
  })
  @IsDefined()
  @IsInt()
  public itemsCount: number;
}