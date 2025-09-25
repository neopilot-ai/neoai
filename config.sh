#!/bin/bash
# NeoAI Build Configuration
# This file contains all configurable parameters for the VSCode build system

# VSCode Repository Settings
VSCODE_REPO_URL="https://github.com/Microsoft/vscode.git"
VSCODE_DIR="vscode"

# Extension Gallery Configuration
EXTENSION_GALLERY_URL="https://marketplace.visualstudio.com/_apis/public/gallery"
EXTENSION_CACHE_URL="https://vscode.blob.core.windows.net/gallery/index"
EXTENSION_ITEM_URL="https://marketplace.visualstudio.com/items"

# Build Settings
NODE_ENV="production"
BUILD_TYPE_MIN="vscode-darwin-min"
BUILD_TYPE_DEB="vscode-linux-x64-build-deb"
BUILD_TYPE_RPM="vscode-linux-x64-build-rpm"

# Platform-specific settings
SUPPORTED_PLATFORMS=("linux" "osx")
DEFAULT_NODE_VERSION="8"

# Package names and patterns
PACKAGE_PREFIX="VSCode"
DARWIN_BUILD_DIR="VSCode-darwin"
LINUX_BUILD_DIR="VSCode-linux-x64"

# Git configuration for tagging
GIT_USER_NAME="GitHub Actions"
GIT_USER_EMAIL="action@github.com"

# Logging settings
LOG_LEVEL="INFO"
LOG_FILE="build.log"

# Retry settings for network operations
MAX_RETRIES=3
RETRY_DELAY=5

# Security settings
ENABLE_SUDO=false
VERIFY_PACKAGES=true

# Function to load environment-specific overrides
load_environment_config() {
    if [[ -f "config.local.sh" ]]; then
        source "config.local.sh"
    fi
}

# Export all variables
export VSCODE_REPO_URL VSCODE_DIR EXTENSION_GALLERY_URL EXTENSION_CACHE_URL
export EXTENSION_ITEM_URL NODE_ENV BUILD_TYPE_MIN BUILD_TYPE_DEB BUILD_TYPE_RPM
export SUPPORTED_PLATFORMS DEFAULT_NODE_VERSION PACKAGE_PREFIX
export DARWIN_BUILD_DIR LINUX_BUILD_DIR GIT_USER_NAME GIT_USER_EMAIL
export LOG_LEVEL LOG_FILE MAX_RETRIES RETRY_DELAY ENABLE_SUDO VERIFY_PACKAGES
