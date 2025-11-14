# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖（包括开发依赖）
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app
RUN corepack enable

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S copilot -u 1001 -G nodejs

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 更改文件所有者
RUN chown -R copilot:nodejs /app
USER copilot

# 暴露端口
EXPOSE 3001

# 启动构建后的应用
CMD ["node", "dist/server.js"]