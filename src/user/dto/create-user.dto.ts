import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ description: '昵称', example: '管理员', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @ApiProperty({ description: '邮箱', example: 'admin@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '手机号', example: '13800138000', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;
}