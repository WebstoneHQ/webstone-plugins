#!/bin/sh
set -e

cd webstone
gp ports await 5173
pnpm test:e2e
