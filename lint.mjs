#!/usr/bin/env node

/**
 * Luke Zhang's developer portfolio
 * Copyright (C) 2020 Luke Zhang Luke-zhang-04.github.io
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @file lint watch with chokidar
 */

import chokidar from "chokidar"
import {exec} from "child_process"

const lint = () => {
    exec("bash lint.sh --watch", (error, stdout, stderr) => {
        if (error) {
            console.log(error)

            return
        }

        if (stderr) {
            console.log(stderr)

            return
        }

        console.log(stdout)
        console.log("Complete!")
    })
}

chokidar.watch("src/").on("change", () => {
    lint()
})

chokidar.watch("scss/").on("change", () => {
    lint()
})

lint()
