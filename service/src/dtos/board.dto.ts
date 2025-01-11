import {
  IsArray,
  IsUUID,
  IsString,
  IsDefined,
  IsInt,
  IsOptional,
  IsJSON,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { BoardColumnDto } from './board-column.dto';

export class BoardDto extends BaseDto {
  @ApiProperty({
    description: 'Board name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first board name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Board description',
    nullable: false,
    required: true,
    example: 'My first board description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'ID of assigned project',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  public projectId: string;

  @ApiProperty({
    description: 'Board metadata - additional board data',
    nullable: true,
    required: false,
    type: Object,
    example: { status: 'active', priority: 'high' },
  })
  @IsOptional()
  @IsJSON()
  public metadata: object;

  @ApiProperty({
    type: [BoardColumnDto],
    required: false,
    description: 'Board columns',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  public boardColumns?: BoardColumnDto[];
}

export class AllBoardsDto {
  @ApiProperty({
    type: [BoardDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardDto)
  public items: BoardDto[];

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
