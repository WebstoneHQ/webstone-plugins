#!/bin/sh
set -e

(
  if [ ! -d "_dev-app" ]
  then
    node ./packages/create-webstone-app/bin.js _dev-app --type=application
  fi
  cd _dev-app
  echo "⏳ Waiting for the CLI's binary to be built..."
  while [ ! -f ../packages/cli/dist/bin.js ]; do sleep 1; done
  pnpm add -D ../packages/cli
  pnpm ws dev
)
