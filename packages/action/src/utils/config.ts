import { z } from "zod";

export const ConfigSchema = z.object({
  apiKey: z.string({
    required_error: "TRANS_API_KEY is required",
    invalid_type_error: "TRANS_API_KEY must be a string",
  }),
  projectId: z.string({
    required_error: "TRANS_PROJECT_ID is required",
    invalid_type_error: "TRANS_PROJECT_ID must be a string",
  }),
  cliVersion: z.string().default("latest"),
  workingDirectory: z.string().default("."),
  createPullRequest: z.boolean().default(false),
  commitMessage: z
    .string()
    .default("chore: (i18n) update translations using Trans.ai"),
  prTitle: z
    .string()
    .optional()
    .default("chore: (i18n) update translations using Trans.ai"),
});

export type Config = z.infer<typeof ConfigSchema>;

export function parseConfig(): Config {
  return ConfigSchema.parse({
    apiKey: process.env.TRANS_API_KEY,
    projectId: process.env.TRANS_PROJECT_ID,
    cliVersion: process.env.TRANS_CLI_VERSION,
    workingDirectory: process.env.TRANS_WORKING_MCPDATA,
    createPullRequest: process.env.TRANS_CREATE_PULL_REQUEST === "true",
    commitMessage:
      process.env.TRANS_COMMIT_MESSAGE || process.env.COMMIT_MESSAGE,
    prTitle: process.env.TRANS_PR_TITLE,
  });
}
