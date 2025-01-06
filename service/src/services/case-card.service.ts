import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseCardEntity } from '../entities';

@Injectable()
export class CaseCardService {
  constructor(
    @InjectRepository(CaseCardEntity)
    private caseCardRepository: Repository<CaseCardEntity>,
  ) { }

  async findAll(): Promise<CaseCardEntity[]> {
    return this.caseCardRepository.find({
      relations: ['boardColumn'],
    });
  }

  async findOne(id: number): Promise<CaseCardEntity | null> {
    return this.caseCardRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.caseCardRepository.delete(id);
  }
}
