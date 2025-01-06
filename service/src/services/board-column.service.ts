import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumnEntity } from '../entities';

@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(BoardColumnEntity)
    private boardColumnRepository: Repository<BoardColumnEntity>,
  ) { }

  async findAll(): Promise<BoardColumnEntity[]> {
    return this.boardColumnRepository.find({
      relations: ['board', 'columnCards'],
    });
  }

  async findOne(id: number): Promise<BoardColumnEntity | null> {
    return this.boardColumnRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.boardColumnRepository.delete(id);
  }
}
