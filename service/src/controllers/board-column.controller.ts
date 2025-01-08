import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
  Query,
} from '@nestjs/common';
import { BoardColumnService } from '../services';
import { AllBoardColumnsDto } from '../dtos';

@Controller('board-columns')
export class BoardColumnController {
  private logger: Logger = new Logger(BoardColumnController.name);

  constructor(private readonly boardColumnService: BoardColumnService) { }

  @Get('/')
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
}
