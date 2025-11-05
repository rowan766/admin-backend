import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuTree } from './interfaces/menu-tree.interface';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // 创建菜单
  async create(createMenuDto: CreateMenuDto) {
    // 如果有父菜单，检查父菜单是否存在
    if (createMenuDto.parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: createMenuDto.parentId },
      });

      if (!parentMenu) {
        throw new NotFoundException('父菜单不存在');
      }

      // 父菜单不能是按钮类型
      if (parentMenu.type === 'button') {
        throw new ConflictException('按钮类型不能作为父菜单');
      }
    }

    // 菜单类型必须有 path 和 component
    if (createMenuDto.type === 'menu') {
      if (!createMenuDto.path) {
        throw new ConflictException('菜单类型必须提供路由路径');
      }
    }

    // 按钮类型必须有 permission
    if (createMenuDto.type === 'button') {
      if (!createMenuDto.permission) {
        throw new ConflictException('按钮类型必须提供权限标识');
      }
    }

    return await this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  // 获取菜单列表（树形结构）
  async findAll(): Promise<MenuTree[]> {
    const menus = await this.prisma.menu.findMany({
      orderBy: { sort: 'asc' },
    });

    // 转换为树形结构
    return this.buildTree(menus as MenuTree[]);
  }

  // 获取单个菜单
  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    return menu;
  }

  // 更新菜单
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id); // 检查菜单是否存在

    // 不能将自己设置为父菜单
    if (updateMenuDto.parentId === id) {
      throw new ConflictException('不能将自己设置为父菜单');
    }

    // 如果更新了父菜单，检查父菜单是否存在
    if (updateMenuDto.parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: updateMenuDto.parentId },
      });

      if (!parentMenu) {
        throw new NotFoundException('父菜单不存在');
      }

      // 父菜单不能是按钮类型
      if (parentMenu.type === 'button') {
        throw new ConflictException('按钮类型不能作为父菜单');
      }
    }

    // 菜单类型必须有 path 和 component
    if (updateMenuDto.type === 'menu') {
      if (updateMenuDto.path === undefined && !updateMenuDto.path) {
        const existMenu = await this.findOne(id);
        if (!existMenu.path) {
          throw new ConflictException('菜单类型必须提供路由路径');
        }
      }
    }

    // 按钮类型必须有 permission
    if (updateMenuDto.type === 'button') {
      if (updateMenuDto.permission === undefined && !updateMenuDto.permission) {
        const existMenu = await this.findOne(id);
        if (!existMenu.permission) {
          throw new ConflictException('按钮类型必须提供权限标识');
        }
      }
    }

    return await this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  // 删除菜单
  async remove(id: number) {
    await this.findOne(id); // 检查菜单是否存在

    // 检查是否有子菜单
    const childrenCount = await this.prisma.menu.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ConflictException('该菜单下有子菜单或按钮，无法删除');
    }

    // 检查是否有角色使用该菜单
    const rolesCount = await this.prisma.roleMenu.count({
      where: { menuId: id },
    });

    if (rolesCount > 0) {
      throw new ConflictException('该菜单已分配给角色，无法删除');
    }

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  // 构建树形结构
  private buildTree(menus: MenuTree[], parentId: number | null = null): MenuTree[] {
    const result: MenuTree[] = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        result.push(menu);
      }
    }

    return result;
  }
}
