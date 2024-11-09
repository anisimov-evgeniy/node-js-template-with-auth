import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  ArrayMinSize,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Jane Doe',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Password for the user (minimum 12 characters)',
    example: 'securepassword1234',
  })
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  readonly password: string;

  @ApiProperty({
    description: 'Roles assigned to the user',
    example: [UserRole.USER, UserRole.ADMIN],
    required: false,
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role must be specified' })
  @IsEnum(UserRole, { each: true }) // Проверяет, что каждый элемент массива соответствует перечислению UserRole
  readonly roles?: UserRole[];
}
