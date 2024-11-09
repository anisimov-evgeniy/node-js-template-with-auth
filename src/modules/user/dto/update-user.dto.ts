import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { each: true })
  readonly roles?: UserRole[];
}
