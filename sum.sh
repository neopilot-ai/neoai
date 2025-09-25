#!/bin/bash

# shasum blows up in Azure, so using this
# node package which has similar syntax and identical output
if [[ "$CI_WINDOWS" == "True" ]]; then
  npm i -g checksum
fi

sum_file () {
  if [[ -f "$1" ]]; then
    if [[ "$CI_WINDOWS" == "True" ]]; then
      checksum -a sha256 "$1" > "$1".sha256
      checksum -a sha1 "$1" > "$1".sha1
    else
      shasum -a 256 "$1" > "$1".sha256
      shasum "$1" > "$1".sha1
    fi
  fi
}

if [[ "$SHOULD_BUILD" == "yes" ]]; then
  if [[ "$OS_NAME" == "osx" ]]; then
    sum_file NeoAI-darwin-*.zip
    sum_file NeoAI*.dmg
  elif [[ "$CI_WINDOWS" == "True" ]]; then
    sum_file NeoAISetup-*.exe
    sum_file NeoAIUserSetup-*.exe
    sum_file NeoAI-win32-*.zip
  else # linux
    cp out/*.AppImage .
    cp vscode/.build/linux/deb/*/deb/*.deb .
    cp vscode/.build/linux/rpm/*/*.rpm .

    sum_file *.AppImage
    sum_file NeoAI-linux*.tar.gz
    sum_file *.deb
    sum_file *.rpm
  fi
fi