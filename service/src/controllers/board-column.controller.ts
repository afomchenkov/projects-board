import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BoardColumnService } from '../services';
import {
  AllBoardColumnsDto,
  BoardColumnDto,
  BulkUpdateBoardColumnDto,
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from '../dtos';

@Controller('board-columns')
export class BoardColumnController {
  private logger: Logger = new Logger(BoardColumnController.name);

  constructor(private readonly boardColumnService: BoardColumnService) { }

  @Get()
  @HttpCode(200)
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

  @Post()
  @HttpCode(201)
  async createBoardColumn(@Body() payload: CreateBoardColumnDto): Promise<{ id: string }> {
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
  @HttpCode(204)
  async deleteBoardColumn(@Param('id') id: string): Promise<void> {
    try {
      await this.boardColumnService.delete(id);

      return Promise.resolve(null);
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }
}
