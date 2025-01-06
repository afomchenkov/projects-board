import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProjectEntity,
  BoardEntity,
  BoardColumnEntity,
  CaseCardEntity
} from '../entities';
import {
  CaseCardService,
  BoardService,
  BoardColumnService,
  ProjectService,
} from '../services';

const entities = [
  ProjectEntity,
  BoardEntity,
  BoardColumnEntity,
  CaseCardEntity
];

const services = [
  CaseCardService,
  BoardService,
  BoardColumnService,
  ProjectService,
]

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
})
export class DBModule { }
