import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingService } from './settings.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule { }