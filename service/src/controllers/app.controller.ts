import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services';

@Controller()
export class AppController {
  constructor(
    private readonly healthService: HealthService,
  ) { }

  @Get('/healthcheck')
  @HealthCheck()
  @HttpCode(200)
  healthcheck(): object {
    return this.healthService.checkTerminus();
  }
}