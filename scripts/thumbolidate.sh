#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"


pushd $DIR/..

./node_modules/.bin/babel-node scripts/thumbolidate.js "$@"

popd > /dev/null
