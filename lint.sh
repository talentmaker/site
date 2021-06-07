#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --cache --max-warnings=0 --fix src &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --cache --max-warnings=0 --fix &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
elif [ "$1" == "-CI" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0 src
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --max-warnings=0

    echo "Completed lint"
else
    echo "Begin lint"
    ./node_modules/.bin/eslint --ext .js,.jsx,.ts,.tsx --cache --max-warnings=0 src &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --cache --max-warnings=0 &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
fi
