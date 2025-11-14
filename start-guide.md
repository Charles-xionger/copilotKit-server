# 启动指南

## 错误原因

错误信息 "The requested agent was not found" 表示 CopilotKit 服务器无法找到 LangGraph agent。

## 解决方案

需要按以下顺序启动服务：

### 1️⃣ 首先启动 LangGraph Agent 服务

在**终端 1**中运行：

```bash
cd /Users/jiangxinbo/Desktop/copilot-kit-demo
pnpm dev:agent
```

或者：

```bash
cd /Users/jiangxinbo/Desktop/copilot-kit-demo/copilotKit-langgraph
npx @langchain/langgraph-cli dev --port 4000 --no-browser
```

等待看到类似以下输出：

```
Ready!
- API: http://127.0.0.1:4000
```

### 2️⃣ 然后启动 CopilotKit 服务器

在**终端 2**中运行：

```bash
cd /Users/jiangxinbo/Desktop/copilot-kit-demo/copilotKit-server
node server.js
```

应该看到：

```
CopilotKit 服务运行在 http://localhost:3001/copilotkit
```

### 3️⃣ 最后启动前端应用

在**终端 3**中运行：

```bash
cd /Users/jiangxinbo/Desktop/copilot-kit-demo
pnpm dev
```

## 或者使用一键启动

在项目根目录运行：

```bash
cd /Users/jiangxinbo/Desktop/copilot-kit-demo
pnpm dev:all
```

## 验证服务是否正常

### 检查 LangGraph 服务

```bash
curl http://localhost:4000/info
```

### 检查 CopilotKit 服务

```bash
curl http://localhost:3001/copilotkit
```

## 故障排查

### 如果仍然报错 "agent was not found"

1. **确认 LangGraph 服务正在运行**

   - 访问 http://localhost:4000
   - 应该看到 LangGraph 的 API 界面

2. **检查 agent 名称是否匹配**

   - `copilotKit-langgraph/langgraph.json` 中的 graphs.agent
   - `copilotKit-server/server.js` 中的 name 和 graphId

3. **检查环境变量**

   - `copilotKit-server/.env` 中的 `LANGGRAPH_URL=http://localhost:4000`

4. **重启所有服务**
   - 停止所有服务（Ctrl+C）
   - 按顺序重新启动

## 当前配置

- **LangGraph Agent**: http://localhost:4000
- **CopilotKit Server**: http://localhost:3001/copilotkit
- **Frontend**: http://localhost:5173
- **Agent Name**: `agent`
- **Graph ID**: `agent`
