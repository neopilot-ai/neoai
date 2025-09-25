#!/bin/bash

set -e

echo "Creating packages..."

if [[ "$SHOULD_BUILD" == "yes" ]]; then
  if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
    echo "Creating macOS package..."
    cd VSCode-darwin
    zip -r "../VSCode-darwin-${LATEST_MS_TAG}.zip" ./*
    cd ..
  else
    echo "Creating Linux package..."
    cd VSCode-linux-x64
    tar czf "../VSCode-linux-x64-${LATEST_MS_TAG}.tar.gz" .
    cd ..
  fi

  echo "Packages created successfully"
else
  echo "Skipping package creation (SHOULD_BUILD != yes)"
fi