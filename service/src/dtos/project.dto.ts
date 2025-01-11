import {
  IsArray,
  IsDefined,
  IsOptional,
  IsInt,
  IsString,
  IsJSON,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { BoardDto } from './board.dto';

export class ProjectDto extends BaseDto {
  @ApiProperty({
    description: 'Project name',
    nullable: false,
    required: true,
    type: String,
    example: 'My first project name',
  })
  @IsDefined()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Project description',
    nullable: false,
    required: true,
    example: 'My first project description',
    type: String,
  })
  @IsDefined()
  @IsString()
  public description: string;

  @ApiProperty({
    description: 'Project metadata - additional project data',
    nullable: true,
    required: false,
    type: Object,
    example: { "status": "active" }
  })
  @IsOptional()
  @IsJSON()
  public metadata: object;

  @ApiProperty({
    type: [BoardDto],
    required: false,
    description: 'Project boards',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardDto)
  public boards?: BoardDto[];
}

export class AllProjectsDto {
  @ApiProperty({
    type: [ProjectDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  public items: ProjectDto[];

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
