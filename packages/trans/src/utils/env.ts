import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

/**
 * Loads environment variables from .env file in the specified working directory
 * Falls back to default values if no .env file exists
 */
export function loadEnv(workingDir: string = process.cwd()) {
  // Try to load .env file
  const env = config({
    path: path.resolve(workingDir, ".env"),
  });

  expand(env);

  return {
    TRANS_DEBUG: env.parsed?.TRANS_DEBUG || false,
    TRANS_BASE_URL: env.parsed?.TRANS_BASE_URL || "https://trans.ai",
    TRANS_PROJECT_ID: env.parsed?.TRANS_PROJECT_ID,
  };
}
