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
import { CaseCardService } from '../services';
import {
  AllCaseCardsDto,
  BulkUpdateCaseCardDto,
  CaseCardDto,
  CreateCaseCardDto,
} from '../dtos';

@Controller('case-cards')
export class CaseCardController {
  private logger: Logger = new Logger(CaseCardController.name);

  constructor(private readonly caseCardService: CaseCardService) { }

  @Get('/')
  @HttpCode(200)
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

  @Post()
  @HttpCode(201)
  async createCaseCard(@Body() payload: CreateCaseCardDto): Promise<{ id: string }> {
    try {
      const createdColumn = await this.caseCardService.create(payload);

      return { id: createdColumn.id };
    } catch (error) {
      this.logger.error(JSON.stringify(error));

      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('/bulk')
  @HttpCode(200)
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
