import { PrismaService } from '../../prisma/prisma.service';

export class DataScopeUtil {
  /**
   * 根据用户的数据权限范围构建部门ID过滤条件
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns 部门ID列表（用于 WHERE departmentId IN (...)），null 表示全部数据权限
   */
  static async getDepartmentIds(prisma: PrismaService, userId: number): Promise<number[] | null> {
    // 获取用户信息（含部门）
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                departments: true,
              },
            },
          },
        },
        department: true,
      },
    });

    if (!user) {
      return [];
    }

    const departmentIds = new Set<number>();

    // 遍历用户的所有角色
    for (const userRole of user.roles) {
      const role = userRole.role;

      switch (role.dataScope) {
        case 1: // 全部数据权限
          // 返回 null 表示不需要过滤部门
          return null;

        case 2: // 本部门及以下数据权限
          if (user.departmentId) {
            // 获取本部门及所有子部门
            const deptIds = await this.getAllChildDepartmentIds(prisma, user.departmentId);
            deptIds.forEach((id) => departmentIds.add(id));
          }
          break;

        case 3: // 本部门数据权限
          if (user.departmentId) {
            departmentIds.add(user.departmentId);
          }
          break;

        case 4: // 仅本人数据权限
          // 这种情况需要额外处理，通常是添加 userId 过滤条件
          // 这里返回空数组，调用方需要自行添加 userId 过滤
          return []; // 返回空数组表示仅本人

        case 5: // 自定义数据权限
          // 添加角色关联的部门
          role.departments.forEach((dept) => {
            departmentIds.add(dept.departmentId);
          });
          break;
      }
    }

    return Array.from(departmentIds);
  }

  /**
   * 获取部门及所有子部门的ID列表
   * @param prisma Prisma服务
   * @param departmentId 部门ID
   * @returns 部门ID列表（包含自身）
   */
  private static async getAllChildDepartmentIds(
    prisma: PrismaService,
    departmentId: number,
  ): Promise<number[]> {
    const result: number[] = [departmentId];

    // 递归查询子部门
    const children = await prisma.department.findMany({
      where: { parentId: departmentId },
    });

    for (const child of children) {
      const childIds = await this.getAllChildDepartmentIds(prisma, child.id);
      result.push(...childIds);
    }

    return result;
  }

  /**
   * 检查用户是否只能看到自己的数据
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns true表示仅本人数据权限
   */
  static async isSelfOnly(prisma: PrismaService, userId: number): Promise<boolean> {
    const departmentIds = await this.getDepartmentIds(prisma, userId);
    return departmentIds !== null && departmentIds.length === 0;
  }

  /**
   * 检查用户是否有全部数据权限
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns true表示全部数据权限
   */
  static async hasAllDataScope(prisma: PrismaService, userId: number): Promise<boolean> {
    const departmentIds = await this.getDepartmentIds(prisma, userId);
    return departmentIds === null;
  }
}
