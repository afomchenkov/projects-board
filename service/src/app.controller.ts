import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './services';

@Controller()
export class AppController {
  constructor(
    private readonly healthService: HealthService,
  ) { }

  @Get('/healthcheck')
  @HealthCheck()
  healthcheck(): object {
    return this.healthService.checkTerminus();
  }
}