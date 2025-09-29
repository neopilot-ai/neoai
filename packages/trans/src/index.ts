#!/usr/bin/env node

import chalk from "chalk";
import dedent from "dedent";
import { runCommands } from "./commands/run.js";
import { loadEnv } from "./utils/env.js";

const { TRANS_BASE_URL } = loadEnv();

if (!process.argv[2]) {
  console.log(
    `
    ██╗      █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗██╗███╗   ██╗███████╗
    ██║     ██╔══██╗████╗  ██║██╔════╝ ██║   ██║██║████╗  ██║██╔════╝
    ██║     ███████║██╔██╗ ██║██║  ███╗██║   ██║██║██║██╗ ██║█████╗  
    ██║     ██╔══██║██║╚██╗██║██║   ██║██║   ██║██║██║╚██╗██║██╔══╝  
    ███████╗██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝██║██║ ╚████║███████╗
    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
    `,
  );

  console.log(
    chalk.gray(dedent`
      Translate your application with Trans CLI powered by AI.
      Website: ${chalk.bold(TRANS_BASE_URL)}
    `),
  );

  console.log();
}

await runCommands();
