import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardColumnDto, CreateBoardColumnDto } from '../dtos';
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

  async create(payload: CreateBoardColumnDto): Promise<BoardColumnEntity | null> {
    const newColumn = await this.boardColumnRepository.create({ ...payload });

    return await this.boardColumnRepository.save(newColumn);
  }

  async remove(id: string): Promise<void> {
    await this.boardColumnRepository.delete(id);
  }
}
