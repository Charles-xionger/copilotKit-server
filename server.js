import { createServer } from "node:http";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
  LangGraphAgent,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const serviceAdapter = new OpenAIAdapter({ openai });

const server = createServer((req, res) => {
  const runtime = new CopilotRuntime({
    agents: {
      agent: new LangGraphAgent({
        deploymentUrl: process.env.LANGGRAPH_URL || "http://localhost:4000",
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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`CopilotKit 服务运行在 http://localhost:${PORT}/copilotkit`);
});
