#!/bin/sh
set -e

gp sync-await dependencies-installed
node ./webstone/packages/create-webstone-app/bin webstone-dev-app