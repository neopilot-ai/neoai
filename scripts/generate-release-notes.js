#!/usr/bin/env node
const { execSync } = require('child_process');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

/**
 * @typedef {Object} Commit
 * @property {string} hash - The git commit hash
 * @property {string} message - The commit message
 * @property {string} author - The commit author
 * @property {string} date - The commit date
 * @property {string} [scope] - The commit scope (extracted from conventional commit message)
 * @property {boolean} [isBreaking] - Whether this is a breaking change
 */

/**
 * @typedef {Object} CommitCategory
 * @property {string} title - Display title for the category
 * @property {Commit[]} commits - Array of commits in this category
 */

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: 'Show changes without writing to file',
    default: false
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Path to the changelog file',
    default: 'CHANGELOG.md'
  })
  .option('package', {
    alias: 'p',
    type: 'string',
    description: 'Path to package.json',
    default: 'package.json'
  })
  .option('repo', {
    alias: 'r',
    type: 'string',
    description: 'GitHub repository in format owner/repo',
    default: 'neopilot-ai/neoai'
  })
  .option('version', {
    alias: 'v',
    type: 'string',
    description: 'Version to use (defaults to version in package.json)'
  })
  .option('yes', {
    alias: 'y',
    type: 'boolean',
    description: 'Skip confirmation prompt',
    default: false
  })
  .help()
  .alias('h', 'help')
  .argv;

// Configuration
const CONFIG = {
  repo: argv.repo,
  changelogFile: path.resolve(process.cwd(), argv.output),
  packageFile: path.resolve(process.cwd(), argv.package),
  dryRun: argv.dryRun,
  autoConfirm: argv.yes
};

/**
 * Logging utility with different log levels and formatting
 */
const log = {
  /**
   * Log an informational message
   * @param {string} msg - Message to log
   */
  info: (msg) => console.log(chalk.blue(`ℹ ${msg}`)),
  
  /**
   * Log a success message
   * @param {string} msg - Message to log
   */
  success: (msg) => console.log(`\n${chalk.green('✓')} ${msg}\n`),
  
  /**
   * Log a warning message
   * @param {string} msg - Message to log
   */
  warn: (msg) => console.log(`\n${chalk.yellow('⚠')} ${msg}\n`),
  
  /**
   * Log an error message and exit the process
   * @param {string|Error} msg - Error message or Error object
   * @param {Error} [error] - Optional error object for stack trace
   */
  error: (msg, error) => {
    const message = msg instanceof Error ? msg.message : msg;
    console.error(`\n${chalk.red('✖')} ${message}\n`);
    if (error?.stack) {
      console.error(chalk.gray(error.stack));
    } else if (msg instanceof Error && msg.stack) {
      console.error(chalk.gray(msg.stack));
    }
    process.exit(1);
  },
  
  /**
   * Log a section header
   * @param {string} msg - Header text
   */
  header: (msg) => console.log(`\n${chalk.blue.bold('='.repeat(60))}\n${msg}\n${'='.repeat(60)}\n`)
};

/**
 * Execute a shell command with proper error handling
 * @param {string} command - The command to execute
 * @param {Object} [options] - Options for execSync
 * @returns {string} The command output
 * @throws {Error} If the command fails
 */
function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      ...options 
    });
  } catch (error) {
    const errorMessage = `Command failed: ${command}\n${error.stderr || error.message}`;
    throw new Error(errorMessage);
  }
}

/**
 * Get git log between two refs
 * @param {string} [from] - Start ref (commit hash, tag, etc.)
 * @param {string} [to='HEAD'] - End ref (defaults to HEAD)
 * @returns {Commit[]} Array of commit objects
 */
function getGitLog(from, to = 'HEAD') {
  try {
    const format = '--pretty=format:%h|%s|%an|%ad|%b';
    const dateFormat = '--date=short';
    const range = from ? `${from}..${to}` : '';
    
    const cmd = `git log ${range} --no-merges ${format} ${dateFormat}`;
    const output = execCommand(cmd);
    
    return output
      .split('\n')
      .filter(Boolean)
      .map(parseCommitLine)
      .filter(Boolean);
  } catch (error) {
    log.error('Failed to get git log', error);
    return [];
  }
}

/**
 * Parse a single line from git log into a commit object
 * @param {string} line - A line from git log output
 * @returns {Commit|undefined} Parsed commit object or undefined if invalid
 */
function parseCommitLine(line) {
  try {
    const [hash, message, author, date, body = ''] = line.split('|');
    if (!hash || !message) return undefined;
    
    // Check for breaking changes in the commit body
    const isBreaking = body.includes('BREAKING CHANGE:') || 
                      body.includes('BREAKING-CHANGE:') ||
                      message.includes('!:'); // Conventional commits breaking change
    
    // Parse conventional commit message
    const conventionalCommit = parseConventionalCommit(message);
    
    return {
      hash,
      message,
      author,
      date,
      body: body.trim(),
      isBreaking,
      ...conventionalCommit
    };
  } catch (error) {
    log.warn(`Failed to parse commit line: ${error.message}`);
    return undefined;
  }
}

/**
 * Parse a conventional commit message
 * @param {string} message - The commit message
 * @returns {{type: string, scope: string, message: string, isBreaking: boolean}}
 */
function parseConventionalCommit(message) {
  const defaultResult = {
    type: 'other',
    scope: 'general',
    message: message.trim(),
    isBreaking: false
  };

  // Match conventional commit format: type(scope?): subject
  // Also supports optional ! for breaking changes: type(scope)!: subject
  // And optional scope with breaking changes: type!: subject
  const match = message.match(/^(\w+)(?:\(([^)]+)\))?(!)?: (.+)/);
  
  if (!match) return defaultResult;
  
  const [, type, scope, breaking, subject] = match;
  const isBreaking = Boolean(breaking) || message.includes('BREAKING CHANGE:');
  
  return {
    type: type.toLowerCase(),
    scope: (scope || 'general').toLowerCase(),
    message: subject.trim(),
    isBreaking
  };
}

/**
 * Get the current version from package.json
 * @returns {string} The current version
 */
function getCurrentVersion() {
  try {
    if (!existsSync(CONFIG.packageFile)) {
      throw new Error(`Package file not found: ${CONFIG.packageFile}`);
    }
    
    const pkg = JSON.parse(readFileSync(CONFIG.packageFile, 'utf8'));
    
    if (argv.version) {
      if (!semver.valid(argv.version)) {
        throw new Error(`Invalid version format: ${argv.version}`);
      }
      return argv.version;
    }
    
    if (!pkg.version) {
      throw new Error('No version found in package.json');
    }
    
    return pkg.version;
  } catch (error) {
    log.error(`Failed to get current version: ${error.message}`, error);
    return '0.0.0';
  }
}

/**
 * Categorize commits by type and scope
 * @param {Commit[]} commits - Array of commit objects
 * @returns {Object.<string, CommitCategory>} Categorized commits
 */
function categorizeCommits(commits) {
  // Define commit types and their display titles
  const types = {
    feat: { title: '✨ Features', commits: [] },
    fix: { title: '🐛 Bug Fixes', commits: [] },
    perf: { title: '⚡ Performance', commits: [] },
    docs: { title: '📚 Documentation', commits: [] },
    style: { title: '💅 Code Style', commits: [] },
    refactor: { title: '♻️ Refactoring', commits: [] },
    test: { title: '🧪 Tests', commits: [] },
    build: { title: '📦 Build System', commits: [] },
    ci: { title: '👷 CI/CD', commits: [] },
    chore: { title: '🔧 Maintenance', commits: [] },
    revert: { title: '⏪ Reverts', commits: [] },
    other: { title: '📝 Other Changes', commits: [] }
  };

  // Categorize each commit
  for (const commit of commits) {
    const type = commit.type in types ? commit.type : 'other';
    types[type].commits.push(commit);
  }

  // Handle breaking changes by promoting them to the top
  const breakingChanges = [];
  
  // Filter out empty categories and process breaking changes
  const result = Object.entries(types)
    .filter(([_, { commits }]) => commits.length > 0)
    .reduce((acc, [type, category]) => {
      // Separate breaking changes
      const breaking = category.commits.filter(c => c.isBreaking);
      const nonBreaking = category.commits.filter(c => !c.isBreaking);
      
      breakingChanges.push(...breaking);
      
      if (nonBreaking.length > 0) {
        acc[type] = {
          ...category,
          commits: nonBreaking
        };
      }
      
      return acc;
    }, {});
  
  // Add breaking changes as a separate section at the top if any exist
  if (breakingChanges.length > 0) {
    result.breaking = {
      title: '🚨 Breaking Changes',
      commits: breakingChanges
    };
  }

  return result;
}

/**
 * Generate markdown from commits
 * @param {string} version - The new version
 * @param {string|null} previousTag - The previous git tag
 * @param {Commit[]} commits - Array of commit objects
 * @returns {string} Generated markdown content
 */
function generateMarkdown(version, previousTag, commits) {
  const date = new Date().toISOString().split('T')[0];
  const compareUrl = previousTag 
    ? `https://github.com/${CONFIG.repo}/compare/${previousTag}...v${version}`
    : `https://github.com/${CONFIG.repo}/releases/tag/v${version}`;
  
  let markdown = `## [v${version}](${compareUrl}) (${date})\n\n`;

  // Add release summary
  const isPreRelease = version.includes('-');
  if (isPreRelease) {
    markdown += '> ⚠️ This is a pre-release version. Use with caution.\n\n';
  }

  // Add categorized changes
  const categories = categorizeCommits(commits);
  
  // Process each category
  for (const [type, { title, commits: categoryCommits }] of Object.entries(categories)) {
    if (categoryCommits.length === 0) continue;
    
    markdown += `### ${title}\n\n`;
    
    // Group by scope
    const groupedCommits = groupCommitsByScope(categoryCommits);
    
    // Sort scopes alphabetically, with 'general' first
    const sortedScopes = Object.keys(groupedCommits).sort((a, b) => {
      if (a === 'general') return -1;
      if (b === 'general') return 1;
      return a.localeCompare(b);
    });

    // Generate commit list for each scope
    for (const scope of sortedScopes) {
      const scopeCommits = groupedCommits[scope];
      
      if (scope !== 'general') {
        markdown += `#### ${formatScope(scope)}\n\n`;
      }
      
      markdown += formatCommitList(scopeCommits);
      markdown += '\n\n';
    }
  }

  // Add contributors section
  markdown += generateContributorsSection(commits);

  return markdown;
}

/**
 * Group commits by their scope
 * @param {Commit[]} commits - Array of commit objects
 * @returns {Object.<string, Commit[]>} Commits grouped by scope
 */
function groupCommitsByScope(commits) {
  return commits.reduce((acc, commit) => {
    const scope = commit.scope || 'general';
    if (!acc[scope]) {
      acc[scope] = [];
    }
    acc[scope].push(commit);
    return acc;
  }, {});
}

/**
 * Format a scope name for display
 * @param {string} scope - The scope name
 * @returns {string} Formatted scope name
 */
function formatScope(scope) {
  if (!scope || scope === 'general') return '';
  return scope
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format a list of commits as markdown
 * @param {Commit[]} commits - Array of commit objects
 * @returns {string} Formatted markdown list of commits
 */
function formatCommitList(commits) {
  return commits
    .map(commit => {
      const shortHash = commit.hash.substring(0, 7);
      const commitUrl = `https://github.com/${CONFIG.repo}/commit/${commit.hash}`;
      
      // Clean up the message by removing any scope prefixes
      let message = commit.message;
      if (commit.scope && commit.scope !== 'general') {
        message = message.replace(new RegExp(`^${commit.scode}:?\\s*`, 'i'), '');
      }
      
      // Add breaking change indicator
      const breakingIndicator = commit.isBreaking ? ' **BREAKING** ' : ' ';
      
      return `-${breakingIndicator}${message} ([${shortHash}](${commitUrl}))`;
    })
    .join('\n');
}

/**
 * Generate contributors section markdown
 * @param {Commit[]} commits - Array of commit objects
 * @returns {string} Markdown for contributors section
 */
function generateContributorsSection(commits) {
  const contributors = [...new Set(commits.map(c => c.author))];
  
  if (contributors.length === 0) return '';
  
  return `### 👥 Contributors\n\n` +
    `Thanks to ${contributors.map(c => `@${c}`).join(', ')} for their contributions!\n\n`;
}

/**
 * Update the CHANGELOG.md file with the new release notes
 * @param {string} version - The new version
 * @param {string|null} previousTag - The previous git tag
 * @param {Commit[]} commits - Array of commit objects
 * @returns {boolean} True if the update was successful
 */
function updateChangelog(version, previousTag, commits) {
  try {
    log.info(`Updating changelog at ${CONFIG.changelogFile}`);
    
    // Create the changelog directory if it doesn't exist
    const changelogDir = path.dirname(CONFIG.changelogFile);
    if (!existsSync(changelogDir)) {
      execCommand(`mkdir -p ${changelogDir}`);
    }
    
    // Read existing changelog or create a new one
    let changelog = '';
    if (existsSync(CONFIG.changelogFile)) {
      changelog = readFileSync(CONFIG.changelogFile, 'utf8');
    } else {
      changelog = '# Changelog\n\n';
      log.info('Created new changelog file');
    }
    
    // Generate the new release notes
    const releaseNotes = generateMarkdown(version, previousTag, commits);
    
    // Insert the new release notes after the changelog header
    const newContent = changelog.replace(
      /(# Changelog\n\n)/,
      `$1${releaseNotes}`
    );
    
    // Write the updated changelog
    writeFileSync(CONFIG.changelogFile, newContent, 'utf8');
    log.success(`Updated ${path.relative(process.cwd(), CONFIG.changelogFile)}`);
    
    return true;
  } catch (error) {
    log.error(`Failed to update changelog: ${error.message}`, error);
    return false;
  }
}

/**
 * Get the previous git tag
 * @returns {string|null} The previous tag or null if not found
 */
function getPreviousTag() {
  try {
    return execCommand('git describe --tags --abbrev=0', { stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (error) {
    // If no tags exist, return null
    if (error.message.includes('No names found')) {
      log.info('No previous tags found - this appears to be the first release');
      return null;
    }
    
    // For other errors, log a warning but continue
    log.warn(`Failed to get previous tag: ${error.message}`);
    return null;
  }
}

/**
 * Main function to generate release notes
 */
async function main() {
  try {
    log.header('📝 Generating Release Notes');
    
    // Get version and git info
    const currentVersion = getCurrentVersion();
    const previousTag = getPreviousTag();
    
    log.info(`Current version: ${chalk.bold(currentVersion)}`);
    
    if (previousTag) {
      log.info(`Previous tag: ${chalk.bold(previousTag)}`);
    }
    
    // Get commits since last tag
    const commits = getGitLog(previousTag);
    
    if (!commits || commits.length === 0) {
      log.warn('No new commits since last release');
      return;
    }
    
    log.info(`Found ${chalk.bold(commits.length)} commits since last release`);
    
    // Generate and display the markdown
    const markdown = generateMarkdown(currentVersion, previousTag, commits);
    
    // Show a preview of the changelog
    console.log('\n' + '='.repeat(80));
    console.log(markdown);
    console.log('='.repeat(80) + '\n');
    
    // In dry-run mode, just show the preview and exit
    if (CONFIG.dryRun) {
      log.success('Dry run complete. No files were modified.');
      return;
    }
    
    // If auto-confirm is enabled, skip the prompt
    if (CONFIG.autoConfirm) {
      await updateChangelogAndStage(currentVersion, previousTag, commits);
      return;
    }
    
    // Otherwise, ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Update CHANGELOG.md with these changes? (y/N) ', async (answer) => {
      readline.close();
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await updateChangelogAndStage(currentVersion, previousTag, commits);
      } else {
        log.info('Changelog not updated');
      }
    });
  } catch (error) {
    log.error('Failed to generate release notes', error);
    process.exit(1);
  }
}

/**
 * Update the changelog and stage it for commit
 * @param {string} version - The new version
 * @param {string|null} previousTag - The previous git tag
 * @param {Commit[]} commits - Array of commit objects
 */
async function updateChangelogAndStage(version, previousTag, commits) {
  const success = updateChangelog(version, previousTag, commits);
  
  if (success) {
    log.success('Changelog updated successfully!');
    
    try {
      // Stage the changelog for commit
      execCommand(`git add ${CONFIG.changelogFile}`);
      log.info(`Staged ${path.relative(process.cwd(), CONFIG.changelogFile)} for commit`);
      
      // If this is a dry run, don't actually commit
      if (!CONFIG.dryRun) {
        log.info('You can now commit the changes with:');
        log.info(`  git commit -m "chore(release): v${version}"`);
      }
    } catch (error) {
      log.warn(`Failed to stage changelog for commit: ${error.message}`);
    }
  }
}

// Only run the script if it's the main module
if (require.main === module) {
  main().catch(error => {
    log.error('An unexpected error occurred', error);
    process.exit(1);
  });
}

// Export functions for testing
module.exports = {
  generateMarkdown,
  categorizeCommits,
  getGitLog,
  getCurrentVersion,
  parseCommitLine,
  parseConventionalCommit,
  groupCommitsByScope,
  formatScope,
  formatCommitList,
  generateContributorsSection,
  // Export for testing only
  _private: {
    execCommand
  }
};
