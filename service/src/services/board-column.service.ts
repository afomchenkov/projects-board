import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BulkUpdateBoardColumnDto,
  BaseResponseDto,
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from '../dtos';
import { BoardColumnEntity, CaseCardEntity } from '../entities';

@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(BoardColumnEntity)
    private boardColumnRepository: Repository<BoardColumnEntity>,
    @InjectRepository(CaseCardEntity)
    private caseCardRepository: Repository<CaseCardEntity>,
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
    return this.boardColumnRepository.findOne({
      where: {
        id,
      },
      relations: ['columnCards'],
    });
  }

  async create(payload: CreateBoardColumnDto): Promise<BoardColumnEntity | null> {
    const newColumn = await this.boardColumnRepository.create({ ...payload });

    return this.boardColumnRepository.save(newColumn);
  }

  async update(id: string, payload: UpdateBoardColumnDto): Promise<BoardColumnEntity | null> {
    const existingRecord = await this.findOne(id);

    if (!existingRecord) {
      throw new NotFoundException(`The Column record not found: ${id}`);
    }

    return this.boardColumnRepository.save({
      ...existingRecord,
      ...payload,
    });
  }

  async bulkUpdate(payload: BulkUpdateBoardColumnDto[] = []): Promise<BoardColumnEntity[]> {
    const updatedItems: BoardColumnEntity[] = [];

    for (const updateBoardColumnPayload of payload) {
      const { id } = updateBoardColumnPayload;

      const updatedRecord = await this.update(id, updateBoardColumnPayload);

      updatedItems.push(updatedRecord);
    }

    return updatedItems;
  }

  async delete(id: string): Promise<BaseResponseDto> {
    const existingColumn = await this.findOne(id);

    if (!existingColumn) {
      throw new NotFoundException(`The Column record not found: ${id}`);
    }

    // delete assigned case cards
    await this.caseCardRepository.delete({ boardColumnId: id });

    // delete board column
    await this.boardColumnRepository.delete(id);

    return { id: existingColumn.id };
  }
}
