#!/bin/bash

set -e  # Exit on any error

echo "Installing system dependencies..."

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  echo "Installing dependencies for macOS..."
  brew update
  brew install yarn --without-node
  brew install jq zip
else
  echo "Installing dependencies for Linux..."
  sudo apt-get update
  sudo apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev fakeroot rpm jq zip
fi

echo "Dependencies installed successfully"