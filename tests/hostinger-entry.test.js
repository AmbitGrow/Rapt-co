import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Hostinger ESM loader starts HTTP listener within 3 seconds", { timeout: 5000 }, async () => {
  const child = spawn(process.execPath, [
    "--input-type=module",
    "--eval",
    'await import("./server/index.js")',
  ], {
    cwd: projectRoot,
    env: {
      ...process.env,
      RAPT_STAGING: "true",
      PORT: "0",
      HOST: "127.0.0.1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  let timer;
  try {
    await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error("Entry did not listen within 3 seconds. " + stderr)), 3000);
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
        if (stdout.includes("[rapt-hostinger] Listening on port 0")) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.once("error", reject);
      child.once("exit", (code) => reject(new Error("Entry exited with " + code + ": " + stderr)));
    });
    assert.match(stdout, /Listening on port 0/);
  } finally {
    clearTimeout(timer);
    child.kill("SIGTERM");
  }
});
