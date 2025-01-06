import { IsUUID, IsString, IsNumber, IsDefined, IsOptional, IsJSON } from 'class-validator';
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
