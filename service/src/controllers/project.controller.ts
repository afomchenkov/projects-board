import {
  Controller,
  InternalServerErrorException,
  Logger,
  Get,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from '../services';
import { AllProjectsDto } from '../dtos';

@Controller('projects')
@ApiTags('Projects API')
export class ProjectController {
  private logger: Logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) { }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get projects endpoint',
    operationId: 'get-all-projects',
  })
  @ApiOkResponse({
    description: 'Successful get all projects response',
    type: AllProjectsDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
