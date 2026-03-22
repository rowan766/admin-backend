# Admin Backend

基于 `NestJS + Prisma + PostgreSQL + Redis + MinIO` 的后台管理系统后端。

当前项目已经整理为：

- 业务模块集中在 `src/modules`
- 公共能力集中在 `src/common`
- 基础设施能力集中在 `src/infrastructure`
- 本地开发以 `Docker Compose` 为主
- 接口文档使用原生 `Scalar`

## 技术栈

- NestJS 11
- Prisma 6
- PostgreSQL 15
- Redis 7
- MinIO
- Scalar API Reference
- Docker Compose
- pnpm

## 目录结构

```text
src/
  modules/                业务模块
    auth/                 认证
    user/                 用户管理
    department/           部门管理
    role/                 角色管理
    menu/                 菜单管理
    dict/                 数据字典
    upload/               文件上传
    system/               开发调试
  common/                 公共能力
    bootstrap/            启动配置
    filters/              全局异常过滤器
    interceptors/         响应封装拦截器
    swagger/              Swagger / Scalar 公共装饰器
    utils/                通用工具
  infrastructure/         基础设施层
    prisma/               Prisma 模块
    redis/                Redis 模块
  app.module.ts
  app.controller.ts
  main.ts
prisma/
data/                     Docker 持久化数据目录
docker-compose.yml
Dockerfile
deploy.md
deploy.sh
```

## 当前模块

当前 `AppModule` 中已注册：

- `AuthModule`
- `UserModule`
- `DepartmentModule`
- `RoleModule`
- `MenuModule`
- `DictModule`
- `UploadModule`
- `SystemModule`
- `PrismaModule`

## 环境变量

项目当前区分两套环境变量：

- `.env`
  用于宿主机本地访问 Docker 服务
- `.env.docker`
  用于后端容器内部访问 `postgres / redis / minio`

### 当前本地 `.env`

```env
POSTGRES_HOST_PORT=15432
MINIO_HOST_PORT=19000
MINIO_CONSOLE_HOST_PORT=19001
REDIS_HOST_PORT=16379
BACKEND_HOST_PORT=3101

DATABASE_URL="postgresql://postgres:123456@localhost:15432/admin_system"
PORT=3101

MINIO_ENDPOINT=localhost
MINIO_PORT=19000

REDIS_HOST=localhost
REDIS_PORT=16379
```

### 当前容器 `.env.docker`

```env
DATABASE_URL="postgresql://postgres:123456@postgres:5432/admin_system"
PORT=3001

MINIO_ENDPOINT=minio
MINIO_PORT=9000

REDIS_HOST=redis
REDIS_PORT=6379
```

## 本地开发

### 推荐方式：全部使用 Docker

在 PowerShell 中执行：

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'

docker compose up -d postgres minio redis
docker compose up -d --build backend
docker exec nestjs-project1-backend pnpm prisma db push
docker compose ps
```

启动成功后可访问：

- API 文档：`http://localhost:3101/api-docs`
- OpenAPI JSON：`http://localhost:3101/api-docs-json`
- MinIO 控制台：`http://localhost:19001`

默认账号：

- PostgreSQL
  - 用户名：`postgres`
  - 密码：`123456`
  - 数据库：`admin_system`
- Redis
  - 密码：`123456`
- MinIO
  - 用户名：`admin`
  - 密码：`12345678`

### 宿主机端口映射

- Backend：`3101 -> 3001`
- PostgreSQL：`15432 -> 5432`
- Redis：`16379 -> 6379`
- MinIO API：`19000 -> 9000`
- MinIO Console：`19001 -> 9001`

### 本机直跑 Nest

可以直接执行：

```powershell
pnpm install
pnpm start:dev
```

但当前项目更推荐 Docker 方式，原因是：

- 数据库、Redis、MinIO 已经在 `docker-compose.yml` 里配好
- 宿主机直连 PostgreSQL 在某些 Windows 环境下更容易遇到端口和连接问题

## 首次初始化说明

当前项目没有内置默认管理员账号，也没有自动种子数据。

也就是说：

- 第一次启动后，数据库是空的
- 需要先创建用户，才能登录拿到 JWT

常见初始化方式有两种：

### 方式一：通过接口创建首个用户

先调用：

- `POST /user`

示例请求体：

```json
{
  "username": "admin",
  "password": "123456",
  "nickname": "管理员",
  "email": "admin@example.com",
  "status": 1
}
```

再调用：

- `POST /auth/login`

示例请求体：

```json
{
  "username": "admin",
  "password": "123456"
}
```

### 方式二：用 Navicat 连接 PostgreSQL 手动初始化

连接参数：

- Host：`127.0.0.1`
- Port：`15432`
- Username：`postgres`
- Password：`123456`
- Database：`admin_system`

如果需要创建根部门，也可以直接用 SQL 初始化。

## 接口文档

当前接口文档使用原生 `Scalar`，入口在：

- `http://localhost:3101/api-docs`

文档特性：

- 支持 Bearer Token 调试
- 按业务标签分组展示
- 直接读取项目生成的 OpenAPI 文档

登录后在文档页中，将 JWT 填入 `Authorization` 鉴权项即可调试需要登录的接口。

## 常用命令

安装依赖：

```bash
pnpm install
```

构建项目：

```bash
pnpm build
```

开发模式：

```bash
pnpm start:dev
```

运行测试：

```bash
pnpm test -- --runInBand
```

启动全部 Docker 服务：

```powershell
docker compose up -d
```

只重建后端：

```powershell
docker compose up -d --build backend
```

同步 Prisma 表结构：

```powershell
docker exec nestjs-project1-backend pnpm prisma db push
```

生成 Prisma Client：

```powershell
docker exec nestjs-project1-backend pnpm prisma generate
```

查看后端日志：

```powershell
docker logs -f nestjs-project1-backend
```

停止服务：

```powershell
docker compose down
```

## 数据持久化

`docker-compose.yml` 已将容器数据目录映射到本地：

- `data/postgres`
- `data/minio`
- `data/redis`

它们分别用于保存：

- PostgreSQL 数据文件
- MinIO 对象文件
- Redis 持久化数据

注意：

- `data/` 已加入 `.gitignore`
- 删除容器通常不会删除数据
- 删除 `data/` 目录会导致本地数据丢失

## 文档与部署

更完整的部署说明见：

- [deploy.md](./deploy.md)

当前 `deploy.sh` 用于 Linux 服务器端更新部署，README 主要面向本地开发与联调。
