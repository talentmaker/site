#!/bin/bash

PS4='\033[0;32m  > \033[0m'
set -e

echo "Begin lint"

if [ "$1" == "--fix" ] || [ "$1" == "-f" ]; then
    set -o xtrace

    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --cache --max-warnings=0 --fix src &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,sass,css}" --cache --max-warnings=0 --fix &

    wait
elif [ "$1" == "-CI" ]; then
    set -o xtrace

    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0 src
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,sass,css}" --max-warnings=0
else
    set -o xtrace

    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --cache --max-warnings=0 src &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,sass,css}" --cache --max-warnings=0 &

    wait
fi

set +o xtrace

echo "Completed lint"
