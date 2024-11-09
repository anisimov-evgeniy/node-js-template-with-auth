import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRecord } from './activity-record.entity';
import { ActivityRecordService } from './activity-record.service';
import { ActivityRecordController } from './activity-record.controller';
import { ChildModule } from '../child/child.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityRecord]), ChildModule],
  providers: [ActivityRecordService],
  controllers: [ActivityRecordController],
})
export class ActivityRecordModule {}
