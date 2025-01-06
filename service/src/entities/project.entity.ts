import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BoardEntity } from './board.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'description' })
  public description: string;

  @Column({
    type: 'jsonb',
    default: () => "{}",
    nullable: true,
  })
  public metadata: object = null;

  @OneToMany(() => BoardEntity, (board) => board.project)
  @JoinColumn({
    name: 'projectId',
    referencedColumnName: 'project_id',
  })
  public boards: BoardEntity[];
}
