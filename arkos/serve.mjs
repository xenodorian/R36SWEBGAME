import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

try {
  const text = readFileSync(resolve(root, ".grok/app-env.json"), "utf8");
  const parsed = JSON.parse(text);
  for (const [key, value] of Object.entries(parsed)) {
    if (key.startsWith("VITE_") && typeof value === "string" && process.env[key] == null) {
      process.env[key] = value;
    }
  }
} catch {
  // A copied SD card has no Grok env file. Auth stays at the app default.
}

const server = await createServer({
  root,
  configFile: resolve(root, "vite.config.ts"),
  server: {
    host: "127.0.0.1",
    port: 8080,
    strictPort: true,
    hmr: false,
    watch: null,
  },
});

await server.listen();
console.log("READY");
