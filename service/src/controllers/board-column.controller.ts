import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { BoardColumnService } from '../services';
import { AllBoardColumnsDto } from '../dtos';

@Controller('board-columns')
export class BoardColumnController {
  private logger: Logger = new Logger(BoardColumnController.name);

  constructor(private readonly boardColumnService: BoardColumnService) { }

  @Get('/')
  async getAllBoardColumns(): Promise<AllBoardColumnsDto> {
    try {
      const items = await this.boardColumnService.findAll();

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
