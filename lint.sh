#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./src/"{*,**/*}"."{js,jsx,ts,tsx}" --max-warnings=0 --fix &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --max-warnings=0 --fix &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
elif [ "$1" == "-CI" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint ./src/"{*,**/*}"."{js,jsx,ts,tsx}" --max-warnings=0
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --max-warnings=0

    echo "Completed lint"
else
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./src/"{*,**/*}"."{js,jsx,ts,tsx}" --max-warnings=0 &
    ./node_modules/.bin/stylelint ./src/"{*,**/*}"."{scss,css}" --max-warnings=0 &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
fi
