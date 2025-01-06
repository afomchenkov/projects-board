import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { ProjectService } from '../services';
import { AllProjectsDto } from '../dtos';

@Controller('projects')
export class ProjectController {
  private logger: Logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) { }

  @Get('/')
  async getAllProjects(): Promise<AllProjectsDto> {
    try {
      const items = await this.projectService.findAll();

      return {
        items,
        itemsCount: items.length,
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }
}
