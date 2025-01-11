import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BoardColumnEntity } from './board-column.entity';

@Entity({ name: 'case_card' })
export class CaseCardEntity extends BaseEntity {
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

  @Column({ name: 'board_column_id' })
  public boardColumnId: string;

  @Column({ name: 'progress' })
  public progress: number;

  @ManyToOne(() => BoardColumnEntity, (boardColumn) => boardColumn.id)
  @JoinColumn({ name: 'board_column_id' })
  public boardColumn: BoardColumnEntity | null;
}
