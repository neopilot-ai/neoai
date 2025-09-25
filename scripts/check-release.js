#!/usr/bin/env node
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
  underline: '\x1b[4m',
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`\n${colors.green}✓ ${msg}${colors.reset}\n`),
  warn: (msg) => console.log(`\n${colors.yellow}⚠ ${msg}${colors.reset}\n`),
  error: (msg) => {
    console.error(`\n${colors.red}✖ ${msg}${colors.reset}\n`);
    process.exit(1);
  },
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

// Check if git is clean
function checkGitStatus() {
  log.header('🔍 Checking Git Status');
  
  try {
    // Check for uncommitted changes
    const status = execSync('git status --porcelain').toString().trim();
    if (status) {
      log.warn('You have uncommitted changes:');
      console.log(status);
      const proceed = confirm('Proceed with release anyway?');
      if (!proceed) {
        process.exit(1);
      }
    } else {
      log.success('Working directory is clean');
    }

    // Check if we're on the main branch
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (!['main', 'master'].includes(branch)) {
      log.warn(`You're not on the main/master branch (current: ${branch})`);
      const proceed = confirm('Proceed with release anyway?');
      if (!proceed) {
        process.exit(1);
      }
    } else {
      log.success(`On ${branch} branch`);
    }

    // Check for unpushed commits
    execSync('git fetch');
    const local = execSync('git rev-parse @').toString().trim();
    const remote = execSync('git rev-parse @{u}').toString().trim();
    const base = execSync('git merge-base @ @{u}').toString().trim();

    if (local === remote) {
      log.success('Local branch is up to date with remote');
    } else if (local === base) {
      log.error('Need to pull changes from remote');
    } else if (remote === base) {
      log.warn('You have unpushed commits');
      const proceed = confirm('Proceed with release anyway?');
      if (!proceed) {
        process.exit(1);
      }
    } else {
      log.warn('Your branch and remote have diverged');
      const proceed = confirm('Proceed with release anyway?');
      if (!proceed) {
        process.exit(1);
      }
    }
  } catch (error) {
    log.error(`Git check failed: ${error.message}`);
  }
}

// Check package.json version
function checkPackageVersion() {
  log.header('📦 Checking Package Version');
  
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    log.info(`Current version: ${pkg.version}`);
    
    // Get latest tag
    let latestTag = '';
    try {
      latestTag = execSync('git describe --tags --abbrev=0').toString().trim();
      latestTag = latestTag.startsWith('v') ? latestTag.slice(1) : latestTag;
      log.info(`Latest release: ${latestTag}`);
      
      if (pkg.version === latestTag) {
        log.warn('Version in package.json matches the latest tag. Did you forget to bump the version?');
      } else {
        log.success(`Version will be bumped to: v${pkg.version}`);
      }
    } catch (e) {
      log.info('No previous tags found');
    }
  } catch (error) {
    log.error(`Failed to read package.json: ${error.message}`);
  }
}

// Check for npm audit issues
function checkAudit() {
  log.header('🔒 Checking for Security Vulnerabilities');
  
  try {
    log.info('Running npm audit...');
    execSync('npm audit', { stdio: 'inherit' });
    log.success('No known security vulnerabilities found');
  } catch (error) {
    log.warn('npm audit found vulnerabilities');
    const proceed = confirm('Proceed with release anyway?');
    if (!proceed) {
      process.exit(1);
    }
  }
}

// Check test status
function checkTests() {
  log.header('🧪 Checking Test Status');
  
  try {
    log.info('Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    log.success('All tests passed');
  } catch (error) {
    log.error('Tests failed. Please fix the failing tests before releasing.');
    process.exit(1);
  }
}

// Helper function to get user confirmation
function confirm(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(`${colors.yellow}${question} [y/N] ${colors.reset}`, answer => {
      readline.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Main function
async function main() {
  try {
    log.header('🚀 Release Pre-flight Check');
    
    // Run checks
    checkGitStatus();
    checkPackageVersion();
    checkAudit();
    checkTests();
    
    log.success('✅ All checks passed! Ready to release!');
  } catch (error) {
    log.error(`Release check failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkGitStatus,
  checkPackageVersion,
  checkAudit,
  checkTests
};
