# CopilotKit Server

基于 Node.js HTTP 的 CopilotKit 运行时服务器，集成 LangGraph Agent。

## 功能特性

- ✅ Node.js HTTP 服务器
- ✅ OpenAI API 集成
- ✅ LangGraph Agent 支持
- ✅ CopilotKit Runtime 接口

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_API_BASE_URL=https://api.openai.com/v1
LANGGRAPH_URL=http://localhost:4000
PORT=3001
```

### 3. 启动服务

#### 开发模式（自动重启）

```bash
pnpm dev
```

#### 生产模式

```bash
pnpm start
```

## 服务信息

- **默认端口**: 3001
- **接口地址**: `http://localhost:3001/copilotkit`
- **依赖服务**: LangGraph Agent (端口 4000)

## 配置说明

### 环境变量

| 变量名                | 说明                | 默认值                      |
| --------------------- | ------------------- | --------------------------- |
| `OPENAI_API_KEY`      | OpenAI API 密钥     | 必填                        |
| `OPENAI_API_BASE_URL` | OpenAI API 基础 URL | `https://api.openai.com/v1` |
| `LANGGRAPH_URL`       | LangGraph 服务地址  | `http://localhost:4000`     |
| `PORT`                | 服务器端口          | `3001`                      |

## 使用示例

在前端应用中集成：

```tsx
import { CopilotKit } from "@copilotkit/react-core";

function App() {
  return (
    <CopilotKit runtimeUrl="http://localhost:3001/copilotkit">
      {/* 你的应用组件 */}
    </CopilotKit>
  );
}
```

## 目录结构

```
copilotKit-server/
├── server.js           # 主服务器文件
├── package.json        # 项目配置
├── .env               # 环境变量（需创建）
├── .env.example       # 环境变量模板
├── .gitignore         # Git 忽略文件
└── README.md          # 文档
```

## 开发说明

### 启动完整开发环境

1. 启动 LangGraph Agent（在项目根目录）：

   ```bash
   cd ../copilotKit-langgraph
   pnpm dev:agent
   ```

2. 启动 CopilotKit Server（本目录）：

   ```bash
   pnpm dev
   ```

3. 启动前端应用（在项目根目录）：
   ```bash
   cd ..
   pnpm dev
   ```

### 修改 Agent 配置

在 `server.js` 中修改 LangGraphAgent 配置：

```javascript
new LangGraphAgent({
  name: "agent",
  description: "你的 Agent 描述",
  url: process.env.LANGGRAPH_URL || "http://localhost:4000",
});
```

## 故障排除

### 端口被占用

修改 `.env` 文件中的 `PORT` 变量：

```env
PORT=3002
```

### 无法连接 LangGraph

确保 LangGraph 服务正在运行：

```bash
cd ../copilotKit-langgraph
pnpm dev:agent
```

### OpenAI API 错误

1. 检查 `.env` 文件中的 `OPENAI_API_KEY` 是否正确
2. 如果使用代理，确认 `OPENAI_API_BASE_URL` 配置正确

## License

MIT
