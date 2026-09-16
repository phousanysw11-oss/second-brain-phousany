#!/bin/sh
cd -- "$(dirname -- "$0")" || exit 1
command -v node >/dev/null 2>&1 || { echo "Install Node.js LTS from https://nodejs.org/en/download then reopen Terminal."; read -r answer; exit 1; }
node app/preflight.mjs || { echo "Fix the FAIL items above, then retry."; read -r answer; exit 1; }
echo "Press Return to close."
read -r answer
