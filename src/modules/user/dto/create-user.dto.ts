import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
