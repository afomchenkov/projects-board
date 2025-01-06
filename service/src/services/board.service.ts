import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardEntity } from '../entities';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardRepository: Repository<BoardEntity>,
  ) { }

  async findAll(): Promise<BoardEntity[]> {
    return this.boardRepository.find({
      relations: ['project', 'boardColumns'],
    });
  }

  async findOne(id: number): Promise<BoardEntity | null> {
    return this.boardRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.boardRepository.delete(id);
  }
}
