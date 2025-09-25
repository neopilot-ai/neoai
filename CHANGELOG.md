# Changelog

All notable changes to this project will be documented in this file.

## Types of Changes

- **Features**: New features or major improvements
- **Bug Fixes**: Bug fixes and patches
  - Includes hotfixes and critical patches
- **Documentation**: Documentation updates
- **Refactor**: Code changes that neither fix bugs nor add features
- **Performance**: Performance improvements
- **Tests**: Adding or updating tests
- **Build**: Changes to build system or dependencies

---

### [1.0.2](https://github.com/neopilot-ai/neoai/compare/v1.0.1...v1.0.2) (2025-09-25)


### 📚 Documentation

* add test file for release process ([0981027](https://github.com/neopilot-ai/neoai/commit/0981027cc3c2b35bd7e7cc3a0890afd0351f4f20))
* enhance changelog with detailed release notes ([c5766fc](https://github.com/neopilot-ai/neoai/commit/c5766fcf73a7b27ca58432884890a742f3103b3b))

## [1.0.1](https://github.com/neopilot-ai/neoai/compare/v1.0.0...v1.0.1) (2025-09-25)

### Documentation

* **test**: add test file for patch release ([22cde4b](https://github.com/neopilot-ai/neoai/commit/22cde4b8f3c8c9f8e3e0a0a8a3e8d8e3a8e3a8e3a))

## [1.0.0](https://github.com/neopilot-ai/neoai/releases/tag/v1.0.0) (2025-09-25)

### Features

* **core**: initial project setup and configuration
* **ci/cd**: implement automated versioning and changelog generation
* **workflow**: add GitHub Actions for CI/CD pipeline

### Documentation

* **readme**: add comprehensive project documentation
* **changelog**: implement automated changelog generation

## How to Update

This changelog is automatically generated using [standard-version](https://github.com/conventional-changelog/standard-version).

- For patch releases: `npm run release:patch`
- For minor releases: `npm run release:minor`
- For major releases: `npm run release:major`

### Pre-releases

For alpha/beta releases, use:
- `npm run release:pre` for patch pre-release
- `npm run release:pre:minor` for minor pre-release
- `npm run release:pre:major` for major pre-release
