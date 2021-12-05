#!/bin/sh
set -e

cd webstone
gp await-port 3000
pnpm test:e2e