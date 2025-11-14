import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  outDir: "dist",
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  // 保持原生 ES 模块导入
  keepNames: true,
  // 不要打包这些依赖（它们应该在 node_modules 中）
  external: ["@copilotkit/runtime", "openai", "dotenv"],
  // 生产环境优化
  esbuildOptions: (options) => {
    options.conditions = ["node"];
    options.mainFields = ["module", "main"];
  },
  onSuccess: async () => {
    console.log("✅ 构建成功！");
  },
});
