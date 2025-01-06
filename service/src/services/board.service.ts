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
      relations: ['project'],
    });
  }

  async findOne(id: string): Promise<BoardEntity | null> {
    return this.boardRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.boardRepository.delete(id);
  }
}
