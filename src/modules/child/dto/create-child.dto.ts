import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChildDto {
  @ApiProperty({
    description: 'Name of the child',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Birth date of the child',
    example: '2022-01-15',
    type: String, // Используем тип String, чтобы указать формат даты
  })
  @IsDate()
  readonly birthDate: Date;

  @ApiPropertyOptional({
    description: 'Gender of the child (optional)',
    example: 'male',
  })
  @IsOptional()
  @IsString()
  readonly gender?: string;

  @ApiProperty({
    description: 'ID of the associated user',
    example: 1,
  })
  @IsNumber()
  readonly userId: number; // Ссылка на пользователя
}
