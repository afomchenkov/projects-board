import { IsArray, IsUUID, IsString, IsDefined, IsNumber, IsOptional, IsJSON, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from './base.dto';

export class CreateCaseCardDto {
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
  public boardColumnId: string;
}

export class UpdateCaseCardDto {
  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  @IsNumber()
  public ordinal: number;

  @IsOptional()
  @IsUUID()
  public boardColumnId: string;
}

export class BulkUpdateCaseCardDto extends UpdateCaseCardDto {
  @IsDefined()
  @IsUUID()
  readonly id: string;
}

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