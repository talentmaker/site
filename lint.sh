#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./src/"{**/*,*}"."{js,jsx,ts,tsx}" --fix &
    ./node_modules/.bin/stylelint ./src/"{**/*,*}"."{scss,css}" --fix &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
else
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./src/"{**/*,*}"."{js,jsx,ts,tsx}" &
    ./node_modules/.bin/stylelint ./src/"{**/*,*}"."{scss,css}" &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
fi
