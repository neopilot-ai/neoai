#!/bin/bash
if [[ "$VSCODE_ARCH" == "x64" ]]; then
  # install a dep needed for this process
  sudo apt-get install desktop-file-utils

  cd ..
  
  bash -e src/resources/linux/appimage/pkg2appimage NeoAI-AppImage-Recipe.yml
fi