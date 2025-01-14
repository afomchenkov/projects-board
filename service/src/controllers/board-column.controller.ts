import {
  Body,
  BadRequestException,
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
import { BoardColumnService } from '../services';
import {
  AllBoardColumnsDto,
  BoardColumnDto,
  BaseResponseDto,
  BulkUpdateBoardColumnDto,
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from '../dtos';

@Controller('board-columns')
@ApiTags('Board Columns API')
export class BoardColumnController {
  private logger: Logger = new Logger(BoardColumnController.name);

  constructor(private readonly boardColumnService: BoardColumnService) { }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get board columns endpoint',
    operationId: 'get-all-board-columns',
  })
  @ApiOkResponse({
    description: 'Successful get all boards columns response',
    type: AllBoardColumnsDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getAllBoardColumns(@Query() query): Promise<AllBoardColumnsDto> {
    try {
      const { boardId } = query;

      const items = await this.boardColumnService.findAll({
        boardId,
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

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get board column endpoint',
    operationId: 'get-board-column',
  })
  @ApiOkResponse({
    description: 'Successful get board column response',
    type: BoardColumnDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getBoardColumn(@Param('id') id: string,): Promise<BoardColumnDto> {
    try {
      const column = await this.boardColumnService.findOne(id);

      return column;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('/')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Creates new board column',
    operationId: 'create-new-board-column',
  })
  @ApiBody({
    type: CreateBoardColumnDto,
    required: true,
    description: 'Payload to create new board column',
  })
  @ApiCreatedResponse({ description: 'Board column created', type: BaseResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createBoardColumn(@Body() payload: CreateBoardColumnDto): Promise<BaseResponseDto> {
    try {
      const createdColumn = await this.boardColumnService.create(payload);

      return { id: createdColumn.id };
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('/bulk')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update boards columns',
    operationId: 'bulk-update-board-column',
  })
  @ApiBody({
    type: [BulkUpdateBoardColumnDto],
    required: true,
    description: 'Payload to update boards columns',
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable board column entity' })
  @ApiOkResponse({ description: 'Board columns updated', type: [BoardColumnDto] })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Board column not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async bulkUpdateBoardColumn(
    @Body() payload: BulkUpdateBoardColumnDto[],
  ): Promise<BoardColumnDto[]> {
    try {
      const updatedColumns = await this.boardColumnService.bulkUpdate(payload);

      return updatedColumns;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update board column',
    operationId: 'update-board-column',
  })
  @ApiBody({
    type: UpdateBoardColumnDto,
    required: true,
    description: 'Payload to update board column',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'The uuid of requested resource' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable board column entity' })
  @ApiOkResponse({ description: 'Board column updated', type: BoardColumnDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Board column not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async updateBoardColumn(
    @Param('id') id: string,
    @Body() payload: UpdateBoardColumnDto,
  ): Promise<BoardColumnDto> {
    if (!id) {
      throw new BadRequestException('Column ID is required');
    }

    try {
      const updatedColumn = await this.boardColumnService.update(id, payload);

      return updatedColumn;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Permanently delete board column',
    operationId: 'delete-board-column',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'The uuid for the item to delete' })
  @ApiResponse({ status: 204, description: 'Board column deleted', type: BaseResponseDto })
  @ApiNotFoundResponse({ description: 'Board column not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteBoardColumn(@Param('id') id: string): Promise<BaseResponseDto> {
    try {
      const response = await this.boardColumnService.delete(id);

      return response;
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }
}
