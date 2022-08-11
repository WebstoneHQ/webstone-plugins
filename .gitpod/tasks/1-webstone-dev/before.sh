#!/bin/sh
set -e

npm install -g pnpm
gp sync-done pnpm-installed-globally
cd webstone
pnpm install
pnpx playwright install-deps
gp sync-done dependencies-installed
