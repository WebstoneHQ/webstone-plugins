#!/bin/sh
set -e

cd webstone
gp await-port 5173
pnpm test:e2e
