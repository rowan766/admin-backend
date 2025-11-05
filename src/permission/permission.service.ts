import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  // 创建权限
  async create(createPermissionDto: CreatePermissionDto) {
    // 检查权限编码是否已存在
    const existPermission = await this.prisma.permission.findUnique({
      where: { code: createPermissionDto.code },
    });

    if (existPermission) {
      throw new ConflictException('权限编码已存在');
    }

    return await this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  // 获取权限列表
  async findAll() {
    return await this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 获取单个权限
  async findOne(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('权限不存在');
    }

    return permission;
  }

  // 更新权限
  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id); // 检查权限是否存在

    // 检查权限编码是否冲突
    if (updatePermissionDto.code) {
      const existPermission = await this.prisma.permission.findUnique({
        where: { code: updatePermissionDto.code },
      });

      if (existPermission && existPermission.id !== id) {
        throw new ConflictException('权限编码已存在');
      }
    }

    return await this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  // 删除权限
  async remove(id: number) {
    await this.findOne(id); // 检查权限是否存在

    // 检查是否有角色使用该权限
    const rolesCount = await this.prisma.rolePermission.count({
      where: { permissionId: id },
    });

    if (rolesCount > 0) {
      throw new ConflictException('该权限已分配给角色，无法删除');
    }

    await this.prisma.permission.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }
}
