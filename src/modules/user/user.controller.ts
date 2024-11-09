import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Public } from '../auth/jwt/public.decorator';
import { User } from './user.entity';

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(RolesGuard) // Применяем Guards
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({
    description: 'User creation data',
    type: CreateUserDto, // Указываем тип DTO для Swagger
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Retrieve all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(@Req() req: any) {
    return this.userService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Информация о текущем пользователе',
    type: User, // Указываем возвращаемый тип (можно использовать DTO)
  })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  async getUserInfo(@Req() request: any) {
    if (!request.user || !request.user.userId) {
      throw new BadRequestException('ID пользователя отсутствует');
    }
    const userId = request.user.userId;
    if (isNaN(userId)) {
      throw new BadRequestException('Некорректный ID пользователя');
    }
    return this.userService.findOne(userId);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Retrieve a user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: 1 })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number, @Req() req: any) {
    if (id !== req.user.id && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('Unauthorized to access this resource');
    }
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: 1 })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (id !== req.user.id && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('Unauthorized to update this user');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'ID of the user', example: 1 })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: number, @Req() req: any) {
    if (id !== req.user.id && !req.user.roles?.includes('admin')) {
      throw new ForbiddenException('Unauthorized to delete this user');
    }
    return this.userService.remove(id);
  }
}
