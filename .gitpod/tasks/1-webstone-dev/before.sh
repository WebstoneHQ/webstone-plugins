#!/bin/sh
set -e

npm install -g pnpm
gp sync-done pnpm-installed-globally
cd webstone
pnpm install
pnpm playwright install
gp sync-done dependencies-installed
