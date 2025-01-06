import { IsArray, IsUUID, IsString, IsDefined, IsNumber, IsOptional, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';

export class CaseCardDto extends BaseDto {
  @IsDefined()
  @IsString()
  public name: string;

  @IsDefined()
  @IsString()
  public description: string;

  @IsDefined()
  @IsNumber()
  public ordinal: number;

  @IsOptional()
  @IsJSON()
  public metadata: object;

  @IsDefined()
  @IsUUID()
  public boardColumnId: string;
}

export class AllCaseCardsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseCardDto)
  public items: CaseCardDto[];

  @IsDefined()
  @IsNumber()
  public itemsCount: number;
}