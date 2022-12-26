#!/bin/sh
set -e

cd webstone-dev-app
while [ ! -f ../webstone/packages/cli/dist/bin.js ]; do sleep 1; done
pnpm add -D ../webstone/packages/cli
pnpm ws dev
