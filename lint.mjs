#!/usr/bin/env node

/**
 * Talentmaker website
 *
 * @copyright (C) 2020 Luke Zhang, Ethan Lim
 * @author Luke Zhang - luke-zhang-04.github.io
 *
 * @license BSD-3-Clause
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
