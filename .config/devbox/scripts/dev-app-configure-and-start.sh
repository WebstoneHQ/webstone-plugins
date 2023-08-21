#!/bin/sh
set -e

(
  if [ ! -d "_dev-app" ]
  then
    node ./packages/create-webstone-app/bin.js _dev-app --type=app
  fi
  cd _dev-app
  echo "⏳ Waiting for the CLI's binary to be built..."
  while [ ! -f ../packages/cli/dist/bin.js ]; do sleep 1; done
  pnpm add -D ../packages/cli

  # Install all plugin-* packages
  for FILE in $(find ../packages/plugin-*/package.json)
  do
    DIR=`dirname $FILE`
    pnpm add -D $DIR
  done

  # Install all plugin-*/cli packages (without nested monorepo)
  # This is for the plugin-trpc package. If / when we migrate that to a monorepo, we can remove this code
  for FILE in $(find ../packages/plugin-*/cli/package.json)
  do
    DIR=`dirname $FILE`
    pnpm add -D $DIR
  done

  # Install all plugin-*/web packages (without nested monorepo)
  # This is for the plugin-trpc package. If / when we migrate that to a monorepo, we can remove this code
  for FILE in $(find ../packages/plugin-*/web/package.json)
  do
    DIR=`dirname $FILE`
    pnpm add -D $DIR
  done

  # Install all plugin-*/cli packages (with nested monorepo)
  for FILE in $(find ../packages/plugin-*/packages/cli/package.json)
  do
    DIR=`dirname $FILE`
    pnpm add -D $DIR
  done

  # Install all plugin-*/web packages (with nested monorepo)
  for FILE in $(find ../packages/plugin-*/packages/web/package.json)
  do
    DIR=`dirname $FILE`
    pnpm add -D $DIR
  done

  pnpm ws dev
)
