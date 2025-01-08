import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BoardColumnEntity } from './board-column.entity';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'board' })
export class BoardEntity extends BaseEntity {
  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'description' })
  public description: string;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: () => "{}",
    nullable: true,
  })
  public metadata: object = null;

  @Column({ name: 'project_id' })
  public projectId: string;

  @ManyToOne(() => ProjectEntity, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  public project: ProjectEntity | null;

  @OneToMany(() => BoardColumnEntity, (boardColumn) => boardColumn.board)
  @JoinColumn({
    name: 'boardId',
    referencedColumnName: 'board_id',
  })
  public boardColumns: BoardColumnEntity[];
}
