import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCaseCardDto } from '../dtos';
import { CaseCardEntity } from '../entities';

@Injectable()
export class CaseCardService {
  constructor(
    @InjectRepository(CaseCardEntity)
    private caseCardRepository: Repository<CaseCardEntity>,
  ) { }

  async findAll(params: { columnId?: string; }): Promise<CaseCardEntity[]> {
    return this.caseCardRepository.find({
      relations: [],
      where: {
        boardColumnId: params.columnId,
      }
    });
  }

  async findOne(id: string): Promise<CaseCardEntity | null> {
    return this.caseCardRepository.findOneBy({ id });
  }

  async create(payload: CreateCaseCardDto): Promise<CaseCardEntity | null> {
    const newCard = await this.caseCardRepository.create({ ...payload });

    return this.caseCardRepository.save(newCard);
  }

  async remove(id: string): Promise<void> {
    await this.caseCardRepository.delete(id);
  }
}
