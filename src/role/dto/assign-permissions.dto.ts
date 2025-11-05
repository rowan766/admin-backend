import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({ description: '权限ID列表', example: [1, 2, 3], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
