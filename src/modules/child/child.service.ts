import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './child.entity';
import { CreateChildDto } from './dto/create-child.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}

  create(createChildDto: CreateChildDto, userId: number): Promise<Child> {
    const newChild = this.childRepository.create({
      ...createChildDto,
      user: { id: userId }, // Связываем ребенка с пользователем
    });
    return this.childRepository.save(newChild);
  }

  findAllForUser(userId: number): Promise<Child[]> {
    return this.childRepository.find({
      where: { user: { id: userId } }, // Фильтрация по пользователю
      relations: ['user', 'activityRecords'],
    });
  }

  findOneForUser(id: number, userId: number): Promise<Child | undefined> {
    return this.childRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'activityRecords'],
    });
  }

  async removeForUser(id: number, userId: number): Promise<void> {
    const child = await this.findOneForUser(id, userId);
    if (!child) {
      throw new Error('Child not found or does not belong to the user');
    }
    await this.childRepository.delete(id);
  }
}
