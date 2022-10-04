#!/bin/sh
set -e

gp sync-await dependencies-installed
node ./webstone/packages/create-webstone-app/bin.js webstone-dev-app --type=application
