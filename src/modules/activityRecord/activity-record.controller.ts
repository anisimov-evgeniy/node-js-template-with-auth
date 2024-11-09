import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ActivityRecordService } from './activity-record.service';
import { CreateActivityRecordDto } from './dto/create-activity-record.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('activity-records') // Группировка маршрутов в Swagger
@ApiBearerAuth('access-token') // Указывает на необходимость авторизации через Bearer токен
@Controller('activity-records')
export class ActivityRecordController {
  constructor(private readonly activityRecordService: ActivityRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity record for a child' })
  @ApiResponse({
    status: 201,
    description: 'Activity record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() createActivityRecordDto: CreateActivityRecordDto,
    @Req() req: any,
  ) {
    const userId = req.user.id; // Извлечение ID пользователя из req.user
    // Создание записи активности только для ребенка, принадлежащего пользователю
    return this.activityRecordService.create(createActivityRecordDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all activity records for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of activity records retrieved successfully',
  })
  findAll(@Req() req: any) {
    const userId = req.user.id; // Извлечение ID пользователя из req.user
    return this.activityRecordService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an activity record by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the activity record',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity record retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Activity record not found' })
  findOne(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    // Получение записи только если она связана с пользователем
    return this.activityRecordService.findOneForUser(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity record by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the activity record',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Activity record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Activity record not found' })
  remove(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    // Удаление записи только если она связана с пользователем
    return this.activityRecordService.removeForUser(id, userId);
  }
}
