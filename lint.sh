#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    ./node_modules/.bin/eslint ./src/**/*."{js,jsx,ts,tsx}" --fix &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" --fix &

    wait
else
    ./node_modules/.bin/eslint ./src/**/*."{js,jsx,ts,tsx}" &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" &

    wait
fi
