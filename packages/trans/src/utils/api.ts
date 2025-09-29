import { loadEnv } from "@/utils/env.js";
import { getAPIKey } from "@/utils/session.js";
import { note } from "@clack/prompts";
import type { AppRouter } from "@neoai/trans-web/src/trpc/routers/_app.js";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

const { TRANS_DEBUG, TRANS_BASE_URL } = loadEnv();

export const client = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: () => TRANS_DEBUG === "true",
    }),
    httpBatchLink({
      url: `${TRANS_BASE_URL}/api/trpc`,
      transformer: superjson,
      headers: () => {
        const apiKey = getAPIKey();

        return {
          "x-api-key": apiKey || undefined,
          "x-trpc-source": "cli",
        };
      },
      fetch: (url, options) => {
        return fetch(url, options).then(async (res) => {
          if (!res.ok) {
            const error = await res.json().catch(() => null);

            if (TRANS_DEBUG === "true") {
              console.log(JSON.stringify(error, null, 2));
            }

            if (error[0]?.error?.json?.message === "UNAUTHORIZED") {
              note(
                "You are not logged in. Please run `trans auth login` first.\nNeed help? https://trans.dev/docs/getting-started",
                "Unauthorized",
              );
              process.exit(1);
            }

            if (error[0]?.error?.json?.message === "NOT_FOUND") {
              note(
                "The resource you are looking for does not exist.\nNeed help? https://trans.ai/docs/getting-started/troubleshooting",
                "Not Found",
              );
              process.exit(1);
            }
          }
          return res;
        });
      },
    }),
  ],
});
