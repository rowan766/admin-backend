## 📋 代码更新完整指南

### 🔧 场景一：只修改了代码（最常见）

**适用情况：**

* 修改了 `src/` 目录下的业务逻辑
* 修改了控制器、服务、DTO 等
* 没有改动数据库表结构

**操作步骤：**

bash

```bash
# ========== 本地操作 ==========
# 1. 在本地修改代码...

# ========== 上传代码 ==========
# 2. 打开 XFTP，上传修改的文件到服务器
#    目标路径：/home/nestjs-project1/backend/src/

# ========== 服务器操作 ==========
# 3. SSH 连接服务器
ssh root@8.130.84.165

# 4. 执行部署脚本
/home/nestjs-project1/deploy.sh

# 完成！
```

**预期结果：**

* ✅ 自动检测代码变化
* ✅ 只重新构建 backend 容器
* ✅ 不影响数据库
* ✅ 大约耗时 2-3 分钟

---

### 🗄️ 场景二：只修改了数据库表结构

**适用情况：**

* 修改了 `prisma/schema.prisma`
* 添加/删除/修改了表或字段
* 没有改动业务代码

**操作步骤：**

bash

```bash
# ========== 本地操作 ==========
# 1. 修改 prisma/schema.prisma
# 比如添加一个字段：
# model User {
#   id        Int      @id @default(autoincrement())
#   username  String
#   newField  String?  // ← 新增字段
# }

# 2. 创建迁移（可选，推荐）
pnpm prisma migrate dev --name add_new_field

# ========== 上传代码 ==========
# 3. 用 XFTP 上传到服务器：
#    - prisma/schema.prisma
#    - prisma/migrations/（如果创建了迁移）

# ========== 服务器操作 ==========
# 4. SSH 连接服务器
ssh root@8.130.84.165

# 5. 执行部署脚本（会自动检测并执行迁移）
/home/nestjs-project1/deploy.sh

# ========== 如果部署脚本没有自动迁移 ==========
# 6. 手动同步数据库
docker exec -it nestjs-project1-backend sh -c "pnpm prisma db push"

# 7. 重启 backend
docker-compose restart backend
```

**预期结果：**

* ✅ 自动检测 Prisma 变化
* ✅ 执行数据库迁移
* ✅ 重新生成 Prisma Client
* ✅ 保留现有数据

---

### 🔄 场景三：同时修改了代码和数据库

**适用情况：**

* 既修改了 `src/` 代码
* 又修改了 `prisma/schema.prisma`
* 添加新功能通常是这种情况

**操作步骤：**

bash

```bash
# ========== 本地操作 ==========
# 1. 修改 prisma/schema.prisma
# 2. 创建迁移
pnpm prisma migrate dev --name your_migration_name

# 3. 修改业务代码...

# ========== 上传代码 ==========
# 4. 用 XFTP 上传到服务器：
#    - src/（整个目录或修改的文件）
#    - prisma/schema.prisma
#    - prisma/migrations/

# ========== 服务器操作 ==========
# 5. SSH 连接服务器
ssh root@8.130.84.165

# 6. 执行部署脚本
/home/nestjs-project1/deploy.sh

# 脚本会自动：
# - 检测代码变化 ✅
# - 检测数据库变化 ✅
# - 重新构建镜像 ✅
# - 执行数据库迁移 ✅
# - 重启服务 ✅

# ========== 验证部署 ==========
# 7. 查看日志
docker-compose logs -f backend

# 8. 测试接口
curl http://localhost:3001/api-docs
```

## 📝 快速参考卡片

### 需要上传的文件清单

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">修改类型</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">需要上传的文件/目录</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><strong>只改代码</strong></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">src/</code> 中修改的文件</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><strong>只改数据库</strong></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">prisma/schema.prisma</code><br><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">prisma/migrations/</code>（如果有）</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><strong>改依赖</strong></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">package.json</code><br><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">pnpm-lock.yaml</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><strong>改配置</strong></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.env.production.example</code><br><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">tsconfig.json</code><br><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.dockerignore</code> 等</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><strong>全部更新</strong></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">除了 <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">node_modules/</code>、<code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">dist/</code>、<code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.git/</code> 外的所有文件</td></tr></tbody></table></pre>

---

### 常用命令速查

bash

```bash
# ========== 部署相关 ==========
# 一键部署（自动检测变化）
/home/nestjs-project1/deploy.sh

# 只重启 backend（代码已上传，快速重启）
docker-compose restart backend

# 重新构建 backend（强制更新）
docker-compose up -d --build --no-deps backend

# ========== 数据库相关 ==========
# 同步数据库结构（推荐，保留数据）
docker exec -it nestjs-project1-backend sh -c "pnpm prisma db push"

# 执行迁移（如果创建了迁移文件）
docker exec -it nestjs-project1-backend sh -c "pnpm prisma migrate deploy"

# 重新生成 Prisma Client
docker exec -it nestjs-project1-backend sh -c "pnpm prisma generate"

# 查看数据库表结构
docker exec -it nestjs-project1-postgres psql -U postgres -d admin_system -c "\d sys_user"

# ========== 日志查看 ==========
# 查看实时日志
docker-compose logs -f backend

# 查看最近 100 行日志
docker-compose logs backend --tail 100

# 查看所有容器状态
docker-compose ps

# ========== 故障排查 ==========
# 进入 backend 容器
docker exec -it nestjs-project1-backend sh

# 进入数据库
docker exec -it nestjs-project1-postgres psql -U postgres -d admin_system

# 重启所有服务
docker-compose restart

# 停止所有服务
docker-compose down

# 启动所有服务
docker-compose up -d
```

## 🚨 重要注意事项

### ⚠️ 避免数据丢失

bash

```bash
# ❌ 不要用这个命令（会删除容器和可能的数据）
docker-compose down

# ✅ 改用这些命令
docker-compose restart backend           # 重启 backend
docker-compose up -d --no-deps backend  # 只重新构建 backend
```

### ⚠️ 数据库迁移前备份

bash

```bash
# 重要数据库变更前，先备份
docker exec nestjs-project1-postgres pg_dump -U postgres -d admin_system > backup_$(date +%Y%m%d).sql
```

### ⚠️ 环境变量管理

bash

```bash
# 本地开发：.env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/admin_system"
MINIO_ENDPOINT=localhost
REDIS_HOST=localhost

# 服务器生产：/home/nestjs-project1/backend/.env
DATABASE_URL="postgresql://postgres:123456@postgres:5432/admin_system"
MINIO_ENDPOINT=minio
REDIS_HOST=redis
```

## 📊 完整工作流程图

```
┌─────────────────────────────────────────────────────┐
│                   本地开发                            │
├─────────────────────────────────────────────────────┤
│  1. 修改代码/数据库                                   │
│  2. 本地测试                                         │
│  3. （数据库变更）创建迁移：                           │
│     pnpm prisma migrate dev                         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│                 上传到服务器                          │
├─────────────────────────────────────────────────────┤
│  用 XFTP 上传：                                       │
│  - src/ (代码变更)                                   │
│  - prisma/ (数据库变更)                              │
│  - package.json (依赖变更)                           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│                  执行部署脚本                         │
├─────────────────────────────────────────────────────┤
│  /home/nestjs-project1/deploy.sh                    │
│                                                      │
│  自动执行：                                           │
│  1. 检测文件变化 (MD5 对比)                          │
│  2. 备份当前版本                                      │
│  3. 重新构建 backend（不停止数据库）                   │
│  4. 执行数据库迁移（如果有）                          │
│  5. 健康检查                                         │
│  6. 保存部署记录                                      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│                   验证部署                            │
├─────────────────────────────────────────────────────┤
│  1. 查看日志：docker-compose logs -f backend         │
│  2. 测试接口：http://8.130.84.165:3001/api-docs     │
│  3. 功能测试                                         │
└─────────────────────────────────────────────────────┘
```

## 🎯 最佳实践

### 1. 日常小改动（只改代码）

bash

```bash
# 修改文件 → XFTP 上传 → 执行部署脚本
/home/nestjs-project1/deploy.sh
```

### 2. 添加新功能（代码+数据库）

bash

```bash
# 本地创建迁移 → XFTP 上传 prisma/ 和 src/ → 执行部署脚本
/home/nestjs-project1/deploy.sh
```

### 3. 紧急修复（快速重启）

bash

```bash
# XFTP 上传 → 直接重启
docker-compose restart backend
```

### 4. 数据库结构不匹配（像今天的问题）

bash

```bash
# 手动同步数据库
docker exec -it nestjs-project1-backend sh -c "pnpm prisma db push"
docker-compose restart backend
```

## 🆘 故障快速恢复

### 部署失败回滚

bash

```bash
# 查看备份
ls -lh /home/nestjs-project1/backups/

# 恢复备份（如果需要）
cp -r /home/nestjs-project1/backups/backup_20251108_143000/dist /home/nestjs-project1/backend/
docker-compose restart backend
```

### 数据库问题

bash

```bash
# 查看表结构
docker exec -it nestjs-project1-postgres psql -U postgres -d admin_system -c "\d sys_user"

# 同步数据库
docker exec -it nestjs-project1-backend sh -c "pnpm prisma db push"
```

### 日志查看

bash

```bash
# 实时日志
docker-compose logs -f backend

# 错误日志
docker-compose logs backend | grep ERROR
```

## 📌 保存这个文档

**建议保存位置：**

* `/home/nestjs-project1/DEPLOYMENT.md`（服务器上）
* 或者本地项目的 `README.md`

---

**现在你有了完整的更新流程！** 🎉

**日常更新只需三步：**

1. 修改代码
2. XFTP 上传
3. 执行 `/home/nestjs-project1/deploy.sh`

简单高效！
