import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) { }

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({
      relations: ['boards'],
    });
  }

  async findOne(id: number): Promise<ProjectEntity | null> {
    return this.projectRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
