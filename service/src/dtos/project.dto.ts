import { IsArray, IsDefined, IsOptional, IsNumber, IsString, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { BoardDto } from './board.dto';

export class ProjectDto extends BaseDto {
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public description: string;

  @IsOptional()
  @IsJSON()
  public metadata: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardDto)
  public boards?: BoardDto[];
}

export class AllProjectsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  public items: ProjectDto[];

  @IsDefined()
  @IsNumber()
  public itemsCount: number;
}
