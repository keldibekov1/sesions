import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from 'enum/role.enum';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Foydalanuvchining ismi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Foydalanuvchi emaili',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Parol kamida 6 ta belgidan iborat bolishi kerak',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'USER',
    description: 'Foydalanuvchi roli',
    enum: Roles,
  })
  @IsNotEmpty()
  @IsEnum(Roles)
  @IsString()
  role: Roles;
}