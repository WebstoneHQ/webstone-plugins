#!/bin/sh
set -e

pnpm playwright install

echo "⏳ Waiting for port 5173 to be ready..."
while ! lsof -i -P -n | grep LISTEN | grep :5173; do sleep 10; done
pnpm test:e2e
