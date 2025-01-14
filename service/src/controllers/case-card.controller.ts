import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Query,
  Logger,
  Post,
  Param,
  Put,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CaseCardService } from '../services';
import {
  AllCaseCardsDto,
  BulkUpdateCaseCardDto,
  CaseCardDto,
  CreateCaseCardDto,
} from '../dtos';

@Controller('case-cards')
@ApiTags('Case Cards API')
export class CaseCardController {
  private logger: Logger = new Logger(CaseCardController.name);

  constructor(private readonly caseCardService: CaseCardService) { }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get board cards by column ID endpoint',
    operationId: 'get-all-board-cards',
  })
  @ApiOkResponse({
    description: 'Successful get all cards response',
    type: AllCaseCardsDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAllCaseCards(@Query() query): Promise<AllCaseCardsDto> {
    try {
      const { columnId } = query;

      const items = await this.caseCardService.findAll({
        columnId,
      });

      return {
        items,
        itemsCount: items.length,
      }
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('/')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates new board card',
    operationId: 'create-new-board-card',
  })
  @ApiBody({
    type: CreateCaseCardDto,
    required: true,
    description: 'Payload to create new board card',
  })
  @ApiCreatedResponse({ description: 'Board card created', type: CaseCardDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createCaseCard(@Body() payload: CreateCaseCardDto): Promise<CaseCardDto> {
    try {
      const createdColumn = await this.caseCardService.create(payload);

      return createdColumn;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('/bulk')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update board cards',
    operationId: 'bulk-update-board-column',
  })
  @ApiBody({
    type: [BulkUpdateCaseCardDto],
    required: true,
    description: 'Payload to update board cards',
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable board card entity' })
  @ApiOkResponse({ description: 'Board cards updated', type: [CaseCardDto] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Board card not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async bulkUpdateCaseCard(
    @Body() payload: BulkUpdateCaseCardDto[],
  ): Promise<CaseCardDto[]> {
    try {
      const updatedCards = await this.caseCardService.bulkUpdate(payload);

      return updatedCards;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Permanently delete column card',
    operationId: 'delete-board-card',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'The uuid for the item to delete' })
  @ApiResponse({ status: 204, description: 'Board card deleted' })
  @ApiNotFoundResponse({ description: 'Board card not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteBCaseCard(@Param('id') id: string): Promise<void> {
    try {
      await this.caseCardService.remove(id);

      return Promise.resolve(null);
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }
}
