#!/bin/sh
set -e

cd webstone-dev-app
while [ ! -f ../webstone/packages/cli/dist/bin.js ]; do sleep 1; done
pnpm add -w -D ../webstone/packages/cli
export HMR_HOST=`gp url 3000`
pnpm ws dev gitpod web-patch-svelte-config-js
pnpm ws dev