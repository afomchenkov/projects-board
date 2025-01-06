import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { CaseCardService } from '../services';
import { AllCaseCardsDto } from '../dtos';

@Controller('case-cards')
export class CaseCardController {
  private logger: Logger = new Logger(CaseCardController.name);

  constructor(private readonly caseCardService: CaseCardService) { }

  @Get('/')
  async getAllCaseCards(): Promise<AllCaseCardsDto> {
    try {
      const items = await this.caseCardService.findAll();

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
