import { IsArray, IsUUID, IsString, IsNumber, IsDefined, IsOptional, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';
import { CaseCardDto } from './case-card.dto';

export class BoardColumnDto extends BaseDto {
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public description: string;

  @IsDefined()
  @IsNumber()
  public ordinal: number;

  @IsDefined()
  @IsUUID()
  public boardId: string;

  @IsOptional()
  @IsJSON()
  public metadata: object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseCardDto)
  public columnCards: CaseCardDto[];
}
