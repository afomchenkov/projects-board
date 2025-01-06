import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { BoardService } from '../services';
import { AllBoardsDto } from '../dtos';

@Controller('boards')
export class BoardController {
  private logger: Logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) { }

  @Get('/')
  async getAllBoards(): Promise<AllBoardsDto> {
    try {
      const items = await this.boardService.findAll();

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
