import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CaseCardEntity } from './case-card.entity';
import { BaseEntity } from './base.entity';
import { BoardEntity } from './board.entity';

@Entity({ name: 'board_column' })
export class BoardColumnEntity extends BaseEntity {
  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'description' })
  public description: string;

  @Column({ name: 'ordinal' })
  public ordinal: number;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: () => "{}",
    nullable: true,
  })
  public metadata: object = null;

  @Column({ name: 'board_id' })
  public boardId: string;

  @ManyToOne(() => BoardEntity, (board) => board.id)
  @JoinColumn({ name: 'board_id' })
  public board: BoardEntity | null;

  @OneToMany(() => CaseCardEntity, (columnCard) => columnCard.boardColumn)
  @JoinColumn({
    name: 'boardColumnId',
    referencedColumnName: 'board_column_id',
  })
  public columnCards: CaseCardEntity[];
}
