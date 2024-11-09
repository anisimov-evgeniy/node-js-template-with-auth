import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityRecord } from './activity-record.entity';
import { CreateActivityRecordDto } from './dto/create-activity-record.dto';
import { ChildService } from '../child/child.service'; // Для проверки связи ребенка с пользователем

@Injectable()
export class ActivityRecordService {
  constructor(
    @InjectRepository(ActivityRecord)
    private readonly activityRecordRepository: Repository<ActivityRecord>,
    private readonly childService: ChildService, // Для проверки принадлежности ребенка пользователю
  ) {}

  async create(
    createActivityRecordDto: CreateActivityRecordDto,
    userId: number,
  ): Promise<ActivityRecord> {
    const { childId } = createActivityRecordDto;
    // Проверяем, принадлежит ли ребенок текущему пользователю
    const child = await this.childService.findOneForUser(childId, userId);
    if (!child) {
      throw new Error('Child not found or does not belong to the user');
    }

    const newRecord = this.activityRecordRepository.create({
      ...createActivityRecordDto,
      child,
    });
    return this.activityRecordRepository.save(newRecord);
  }

  findAllForUser(userId: number): Promise<ActivityRecord[]> {
    return this.activityRecordRepository.find({
      where: { child: { user: { id: userId } } }, // Предполагаемая связь с пользователем через ребенка
      relations: ['child'],
    });
  }

  async findOneForUser(
    id: number,
    userId: number,
  ): Promise<ActivityRecord | undefined> {
    return this.activityRecordRepository.findOne({
      where: { id, child: { user: { id: userId } } },
      relations: ['child'],
    });
  }

  async removeForUser(id: number, userId: number): Promise<void> {
    const record = await this.findOneForUser(id, userId);
    if (!record) {
      throw new Error(
        'Activity record not found or does not belong to the user',
      );
    }
    await this.activityRecordRepository.delete(id);
  }
}
