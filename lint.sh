#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./*/**/*."{js,jsx,ts,tsx}" --fix &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" --fix &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
elif [ "$1" == "-CI" ]; then
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./*/**/*."{js,jsx,ts,tsx}"
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}"

    echo "Completed lint"
else
    echo "Begin lint"
    ./node_modules/.bin/eslint_d ./*/**/*."{js,jsx,ts,tsx}" &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
fi
