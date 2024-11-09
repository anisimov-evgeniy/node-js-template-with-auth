import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('children') // Тег для группировки маршрутов в Swagger
@ApiBearerAuth('access-token') // Указывает, что маршруты защищены JWT-токеном
@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new child record for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'Child record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createChildDto: CreateChildDto, @Req() req: any) {
    const userId = req.user.id; // Извлечение ID пользователя из req.user
    return this.childService.create(createChildDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all children for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of children retrieved successfully',
  })
  findAll(@Req() req: any) {
    const userId = req.user.id; // Извлечение ID пользователя из req.user
    return this.childService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a child record by ID' })
  @ApiParam({ name: 'id', description: 'ID of the child record', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Child record retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Child record not found' })
  findOne(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    // Можно добавить проверку принадлежности child к user
    return this.childService.findOneForUser(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a child record by ID' })
  @ApiParam({ name: 'id', description: 'ID of the child record', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Child record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Child record not found' })
  remove(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    // Можно добавить проверку принадлежности child к user перед удалением
    return this.childService.removeForUser(id, userId);
  }
}
