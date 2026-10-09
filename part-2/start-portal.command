#!/bin/bash
# Starts the BaaS design system portal and opens it in the browser. Double-click this file in Finder.
cd "$(dirname "$0")" || exit 1
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is not installed. Install the LTS version from https://nodejs.org and double-click this file again."
  read -r -p "Press Enter to close."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "First run: installing dependencies (about a minute)..."
  npm install || { read -r -p "Install failed. Press Enter to close."; exit 1; }
fi
(sleep 4; open "http://localhost:5180") &
echo "Portal: http://localhost:5180  —  keep this window open. Press Ctrl+C to stop."
npm run dev
read -r -p "The portal stopped. Press Enter to close."
