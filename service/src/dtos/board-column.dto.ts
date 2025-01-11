import {
  IsArray,
  IsUUID,
  IsString,
  IsInt,
  IsDefined,
  IsOptional,
  IsJSON,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from './base.dto';
import { CaseCardDto } from './case-card.dto';

export class CreateBoardColumnDto {
  @ApiProperty({
    description: 'Column name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first column name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Column description',
    nullable: false,
    required: true,
    example: 'My first column description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Serial of the column on the board',
    nullable: false,
    required: true,
    type: Number,
    example: 1,
  })
  @IsDefined()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'ID of assigned board',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  public boardId: string;
}

export class UpdateBoardColumnDto {
  @ApiProperty({
    description: 'Column name',
    required: false,
    type: String,
    example: 'My first column name',
  })
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Column description',
    required: false,
    example: 'My first column description',
    type: String,
  })
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Serial of the column on the board',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    required: false,
    description: 'ID of assigned board',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  public boardId: string;
}

export class BulkUpdateBoardColumnDto extends UpdateBoardColumnDto {
  @ApiProperty({
    required: false,
    description: 'ID of column',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  readonly id: string;
}

export class BoardColumnDto extends BaseDto {
  @ApiProperty({
    description: 'Column name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first column name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Column description',
    nullable: false,
    required: true,
    example: 'My first column description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Serial of the column on the board',
    nullable: false,
    required: true,
    type: Number,
  })
  @IsDefined()
  @IsInt()
  public ordinal: number;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'ID of assigned board',
    example: 'ce2c97af-17e4-4d85-8248-d7ba8b45527f',
    format: 'uuid',
  })
  @IsDefined()
  @IsUUID()
  public boardId: string;

  @ApiProperty({
    description: 'Board column metadata - additional column data',
    nullable: true,
    required: false,
    type: Object,
    example: { status: 'active', priority: 'high' },
  })
  @IsOptional()
  @IsJSON()
  public metadata: object;

  @ApiProperty({
    type: [CaseCardDto],
    required: false,
    description: 'Column Cards',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseCardDto)
  public columnCards?: CaseCardDto[];
}

export class AllBoardColumnsDto {
  @ApiProperty({
    type: [BoardColumnDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  public items: BoardColumnDto[];

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
