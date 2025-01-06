import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService, PingIndicatorService } from './services';
import { SettingModule } from './settings/settings.module';
import { SettingService } from './settings/settings.service';
import { DBModule } from './settings/db.module';
import {
  AppController,
  CaseCardController,
  BoardController,
  BoardColumnController,
  ProjectController,
} from './controllers';

const controllers = [
  AppController,
  CaseCardController,
  BoardController,
  BoardColumnController,
  ProjectController,
]

@Module({
  imports: [
    TerminusModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DBModule,
    TypeOrmModule.forRootAsync({
      imports: [SettingModule],
      inject: [SettingService],
      useFactory: (settingService: SettingService) => {
        return settingService.typeOrmUseFactory;
      },
    }),
  ],
  controllers,
  providers: [PingIndicatorService, HealthService],
})
export class AppModule { }