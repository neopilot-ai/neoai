import { checkHealth as checkDbHealth } from "@neoai/db/utils/health";

export async function checkHealth(): Promise<void> {
  await checkDbHealth();
}
