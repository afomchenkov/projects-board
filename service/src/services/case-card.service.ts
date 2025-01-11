import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BulkUpdateCaseCardDto,
  CreateCaseCardDto,
  UpdateCaseCardDto,
 } from '../dtos';
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

  async update(id: string, payload: UpdateCaseCardDto): Promise<CaseCardEntity | null> {
    const existingRecord = await this.findOne(id);

    if (!existingRecord) {
      throw new NotFoundException(`The Card record not found: ${id}`);
    }

    return this.caseCardRepository.save({
      ...existingRecord,
      ...payload,
    });
  }

  async bulkUpdate(payload: BulkUpdateCaseCardDto[] = []): Promise<CaseCardEntity[]> {
    const updatedItems: CaseCardEntity[] = [];

    for (const updatedCardPaylod of payload) {
      const { id } = updatedCardPaylod;

      const updatedRecord = await this.update(id, updatedCardPaylod);

      updatedItems.push(updatedRecord);
    }

    return updatedItems;
  }

  async remove(id: string): Promise<void> {
    await this.caseCardRepository.delete(id);
  }
}
