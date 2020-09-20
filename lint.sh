#!/bin/bash

if [ "$1" == "--fix" ]||[ "$1" == "-f" ]; then
    echo "Begin lint"
    ./node_modules/.bin/esprint --fix &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" --fix &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
else
    echo "Begin lint"
    ./node_modules/.bin/esprint &
    ./node_modules/.bin/stylelint ./*/**/*."{scss,css}" &

    echo "Waiting for lint to finish..."
    wait

    echo "Completed lint"
fi
