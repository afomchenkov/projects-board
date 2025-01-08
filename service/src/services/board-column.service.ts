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

  async findAll(params: { boardId?: string; }): Promise<BoardColumnEntity[]> {
    return this.boardColumnRepository.find({
      relations: ['board', 'columnCards'],
      where: {
        board: {
          id: params.boardId
        },
      },
    });
  }

  async findOne(id: string): Promise<BoardColumnEntity | null> {
    return this.boardColumnRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.boardColumnRepository.delete(id);
  }
}
