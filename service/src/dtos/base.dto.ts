import { IsUUID, IsString, IsDefined } from 'class-validator';

export class BaseDto {
  @IsDefined()
  @IsUUID()
  readonly id: string;

  @IsDefined()
  @IsString()
  public createdAt: string;

  @IsDefined()
  @IsString()
  public updatedAt: string;
}
