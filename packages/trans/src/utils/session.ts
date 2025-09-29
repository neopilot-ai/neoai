import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface TransSession {
  id: string;
  name: string;
  email: string;
  apiKey: string;
}

const SESSION_FILE = join(homedir(), ".trans");

export function saveSession(sessionData: TransSession): void {
  writeFileSync(SESSION_FILE, JSON.stringify(sessionData), { mode: 0o600 });
}

export function loadSession(): TransSession | null {
  if (existsSync(SESSION_FILE)) {
    try {
      return JSON.parse(readFileSync(SESSION_FILE, "utf-8"));
    } catch (error) {
      return null;
    }
  }

  return null;
}

export function clearSession(): void {
  if (existsSync(SESSION_FILE)) {
    unlinkSync(SESSION_FILE);
  }
}

export function getAPIKey(): string | null {
  if (process.env.TRANS_API_KEY) {
    return process.env.TRANS_API_KEY;
  }

  const session = loadSession();

  if (!session) {
    return null;
  }

  return session.apiKey;
}
