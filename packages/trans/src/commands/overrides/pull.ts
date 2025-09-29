import { mkdir } from "node:fs/promises";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createParser } from "@/parsers/index.ts";
import type { Config } from "@/types.js";
import { client } from "@/utils/api.js";
import { loadConfig } from "@/utils/config.ts";
import { loadSession } from "@/utils/session.js";
import { intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";
import { z } from "zod";

interface Translation {
  translationKey: string;
  translatedText: string;
  sourceFile: string;
  targetLanguage: string;
  sourceFormat: string;
}

type GroupedOverrides = Record<string, Record<string, Translation[]>>;

const argsSchema = z.array(z.string()).transform((args) => {
  const localesIndex = args.findIndex((arg) => arg.startsWith("--locales="));
  return {
    locales:
      localesIndex !== -1 ? args[localesIndex].slice(9).split(",") : undefined,
  };
});

// Helper function to get target file path
function getTargetPath(
  sourceFile: string,
  locale: string,
  config: Config,
): string {
  // Find the matching file format configuration based on the source file extension
  const sourceExt = sourceFile.split(".").pop() || "";
  const fileFormat = Object.entries(config.files).find(([format]) => {
    // Check if the format matches the file extension
    // Handle special cases like 'ts' matching '.ts' files
    return format === sourceExt;
  });

  if (!fileFormat) {
    throw new Error(`No matching file configuration found for ${sourceFile}`);
  }

  // Get the first include pattern
  const pattern = fileFormat[1].include[0];
  const globPattern = typeof pattern === "string" ? pattern : pattern.glob;

  if (globPattern.includes("*")) {
    // If the pattern contains a wildcard, it's a directory-based pattern
    // Replace [locale] in the directory structure and keep the source filename
    const sourceFilename = sourceFile.split("/").pop() || "";
    const targetDir = dirname(globPattern).replace("[locale]", locale);
    return join(targetDir, sourceFilename);
  }

  // If no wildcard, it's a file-based pattern
  // Simply replace [locale] in the entire pattern
  return globPattern.replace("[locale]", locale);
}

export async function pullCommand(args: string[] = []) {
  intro("Pull translation overrides");

  // Check authentication
  const session = loadSession();
  if (!session) {
    console.log(chalk.yellow("You need to be logged in to pull overrides."));
    process.exit(1);
  }

  // Load config
  const config = await loadConfig();
  if (!config) {
    outro(
      chalk.red("No configuration file found. Run 'trans init' to create one."),
    );
    process.exit(1);
  }

  const { locales } = argsSchema.parse(args);
  const targetLocales = locales || config.locale.targets;

  const s = spinner();
  s.start("Pulling overrides...");

  try {
    const overrides = await client.translate.getOverriddenTranslations.query({
      projectId: config.projectId!,
    });

    // Group overrides by source file and target language
    const groupedOverrides = overrides.reduce(
      (acc: GroupedOverrides, override: Translation) => {
        if (!acc[override.sourceFile]) {
          acc[override.sourceFile] = {};
        }
        if (!acc[override.sourceFile][override.targetLanguage]) {
          acc[override.sourceFile][override.targetLanguage] = [];
        }
        acc[override.sourceFile][override.targetLanguage].push(override);
        return acc;
      },
      {} as GroupedOverrides,
    );

    // Process each source file that has overrides
    for (const [sourceFile, localeOverrides] of Object.entries(
      groupedOverrides,
    )) {
      // Process each locale that has overrides for this file
      for (const [locale, overridesForLocale] of Object.entries(
        localeOverrides as Record<string, Translation[]>,
      )) {
        if (!targetLocales.includes(locale)) continue;
        if (overridesForLocale.length === 0) continue;

        const targetPath = getTargetPath(sourceFile, locale, config);
        const parser = createParser({
          type: overridesForLocale[0].sourceFormat,
        });

        // Create directory if it doesn't exist
        await mkdir(dirname(targetPath), { recursive: true });

        // Read existing translations or create empty object
        let existingTranslations: Record<string, string> = {};
        try {
          const content = await readFile(targetPath, "utf-8");
          existingTranslations = await parser.parse(content);
        } catch (error) {
          // File doesn't exist or can't be parsed, use empty object
        }

        // Apply overrides
        for (const override of overridesForLocale) {
          existingTranslations[override.translationKey] =
            override.translatedText;
        }

        // Write back to file
        const serialized = await parser.serialize(locale, existingTranslations);
        await writeFile(targetPath, serialized);
      }
    }

    s.stop("Overrides pulled successfully");
    outro(
      chalk.green("Overrides have been applied to your translation files."),
    );
  } catch (error) {
    s.stop("Failed to pull overrides");
    outro(chalk.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
}
