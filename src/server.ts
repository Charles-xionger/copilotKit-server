import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { parse } from "node:url";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
  LangGraphAgent,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import "dotenv/config";

// 类型定义
interface HealthResponse {
  status: string;
  timestamp: string;
  version?: string;
}

interface ServerConfig {
  port: number;
  host: string;
  nodeEnv: string;
}

// 配置
const config: ServerConfig = {
  port: parseInt(process.env.PORT || "3001", 10),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
};

// 验证必需的环境变量
const requiredEnvVars = ["OPENAI_API_KEY", "OPENAI_API_BASE_URL"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ 缺少必需的环境变量: ${envVar}`);
    process.exit(1);
  }
}

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_API_BASE_URL!,
});

const serviceAdapter = new OpenAIAdapter({ openai });

// 创建服务器
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || "", true);

  // 健康检查端点
  if (pathname === "/health") {
    const healthResponse: HealthResponse = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      ...(process.env.npm_package_version
        ? { version: process.env.npm_package_version }
        : {}),
    };

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    });
    res.end(JSON.stringify(healthResponse, null, 2));
    return;
  }

  // CopilotKit 运行时
  const runtime = new CopilotRuntime({
    agents: {
      agent: new LangGraphAgent({
        deploymentUrl: process.env.LANGGRAPH_URL || "http://langgraph:8123",
        graphId: "agent",
        langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
        description: "简单聊天代理",
      }),
    },
  });

  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: "/copilotkit",
    runtime,
    serviceAdapter,
  });

  return handler(req, res);
});

// 启动服务器
server.listen(config.port, config.host, () => {
  console.log(
    `🚀 CopilotKit 服务运行在 http://${config.host}:${config.port}/copilotkit`
  );
  console.log(`🔍 健康检查端点: http://${config.host}:${config.port}/health`);
  console.log(`🌍 环境: ${config.nodeEnv}`);
});

// 优雅关闭处理
const gracefulShutdown = (signal: string) => {
  console.log(`\n📡 收到 ${signal} 信号，正在优雅关闭...`);

  server.close((err) => {
    if (err) {
      console.error("❌ 关闭服务器时出错:", err);
      process.exit(1);
    }

    console.log("✅ HTTP 服务器已关闭");
    process.exit(0);
  });

  // 强制关闭超时
  setTimeout(() => {
    console.error("⚠️  强制关闭超时，立即退出");
    process.exit(1);
  }, 10000);
};

// 信号处理
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// 未捕获的异常处理
process.on("uncaughtException", (err) => {
  console.error("❌ 未捕获的异常:", err);
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ 未处理的Promise拒绝:", reason, "at:", promise);
  gracefulShutdown("unhandledRejection");
});

export { server };
