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
} from '@nestjs/common';
import { BoardColumnService } from '../services';
import { AllBoardColumnsDto, BoardColumnDto, CreateBoardColumnDto } from '../dtos';

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

  @Put('/:id')
  @HttpCode(201)
  async updateBoardColumn(
    @Param('id') id: string,
    @Body() payload: BoardColumnDto,
  ): Promise<BoardColumnDto> {
    try {
      return Promise.resolve(null);
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteBoardColumn(@Param('id') id: string): Promise<void> {
    try {
      await this.boardColumnService.remove(id);

      return Promise.resolve(null);
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }
}
