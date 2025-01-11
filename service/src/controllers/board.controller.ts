import {
  Controller,
  Logger,
  InternalServerErrorException,
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
import { BoardService } from '../services';
import { AllBoardsDto } from '../dtos';

@Controller('boards')
@ApiTags('Boards API')
export class BoardController {
  private logger: Logger = new Logger(BoardController.name);

  constructor(private readonly boardService: BoardService) { }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get boards endpoint',
    operationId: 'get-all-boards',
  })
  @ApiOkResponse({
    description: 'Successful get all boards response',
    type: AllBoardsDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
