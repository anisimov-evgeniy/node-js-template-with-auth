import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityType } from '../activity-record.entity';

export class CreateActivityRecordDto {
  @ApiProperty({
    description: 'Type of the activity (e.g., feeding, sleep)',
    enum: ActivityType,
    example: ActivityType.FEEDING,
  })
  @IsEnum(ActivityType)
  activityType: ActivityType;

  @ApiProperty({
    description: 'ID of the associated child',
    example: 1,
  })
  @IsNumber()
  childId: number;

  @ApiProperty({
    description: 'Start time of the activity',
    example: '2024-11-07T15:30:00Z',
    type: String, // Указываем тип String для представления даты/времени
  })
  @IsDate()
  startTime: Date;

  @ApiPropertyOptional({
    description: 'End time of the activity (optional)',
    example: '2024-11-07T17:00:00Z',
    type: String,
  })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @ApiPropertyOptional({
    description: 'Amount related to the activity (e.g., ml for feeding)',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Additional notes related to the activity',
    example: 'Baby fed 150ml of milk.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
