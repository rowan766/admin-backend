import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permissions';

// 权限装饰器：用于标记接口需要的权限
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
