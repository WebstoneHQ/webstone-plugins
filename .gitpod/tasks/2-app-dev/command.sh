#!/bin/sh
set -e

cd webstone-dev-app
while [ ! -f ../webstone/packages/cli/dist/bin.js ]; do sleep 1; done
pnpm add -D ../webstone/packages/cli

# Install all plugin-*/cli packages
for FILE in $(find ../webstone/packages/plugin-*/cli/package.json)
do
  DIR=`dirname $FILE`
  pnpm add -D $DIR
done

# Install all plugin-*/web packages
for FILE in $(find ../webstone/packages/plugin-*/web/package.json)
do
  DIR=`dirname $FILE`
  pnpm add -D $DIR
done

pnpm ws dev
