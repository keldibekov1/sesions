import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Foydalanuvchi paroli',
    minLength: 6,
  })
  @MinLength(6)
  @IsOptional()
  password: string;

  @ApiPropertyOptional({
    example: '192.168.1.1',
    description: 'Foydalanuvchining IP manzili',
  })
  @IsOptional()
  ip: string;
}