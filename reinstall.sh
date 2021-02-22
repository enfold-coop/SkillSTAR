#!/usr/bin/env bash
# Removes and re-installs all node modules and expo directory.
set -o errexit

main() {
  rm -rf node_modules
  rm -rf package-lock.json
  rm -rf .expo
  npm install
  expo install
}

main "${@}"
