import { IsArray, IsUUID, IsString, IsDefined, IsOptional, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { BoardColumnDto } from './board-column.dto';

export class BoardDto extends BaseDto {
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public description: string;

  @IsDefined()
  @IsUUID()
  public projectId: string;

  @IsOptional()
  @IsJSON()
  public metadata: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardColumnDto)
  public boardColumns: BoardColumnDto[];
}
