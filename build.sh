#!/usr/bin/env bash

# Talentmaker website
#
# Copyright (C) 2020 Luke Zhang - Luke-zhang-04.github.io
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" # Get location of this script
. "${DIR}/colours.sh"

build() {
    printf "${Yellow}Compiling ${Red}scss/${Cyan} to ${Blue}public/css ${Cyan}with ${Red}SASS${Cyan}\n"
    sass scss:public/css --style compressed || npx sass scss:public/css --style compressed
    printf "${IGreen}Done!${Cyan}\n\n"

    printf "${Red}Building with ${Blue}react-scripts build${Cyan}\n"
    npx react-scripts build
    printf "${IGreen}Done!${Cyan}"
}

watch() {
    printf "${IBlue}Watching ${Red}SASS ${Cyan}with ${Red}SASS${Cyan}\n"
    sass scss:public/css --watch &

    printf $"${IBlue}Warching ${Cyan}with ${Blue}react-scripts build${Cyan}\n"
    npx react-scripts start &

    wait
}

if [[ $1 == "--only" ]]; then
    if [[ $2 == "sass" ]]; then
        sass scss:public/css --style compressed || npx sass scss:public/css --style compressed
    else
        printf "${BIRed}ERROR: ${Purple}Unknown option $2 for $1\n"
    fi
elif [[ $1 == "-w" ]]||[[ $1 == "--watch" ]]; then
    watch
else
    build
fi
