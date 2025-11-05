import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, MaxLength, IsIn } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限名称', example: '创建用户' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '权限编码', example: 'user:create' })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiProperty({ description: 'API路径', example: '/user', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  path?: string;

  @ApiProperty({ description: '请求方法', example: 'POST', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: false })
  @IsString()
  @IsOptional()
  @IsIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
  method?: string;

  @ApiProperty({ description: '权限描述', example: '创建用户的权限', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '状态：1启用 0禁用', example: 1, required: false })
  @IsInt()
  @IsOptional()
  status?: number;
}
