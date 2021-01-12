/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file utility functions for cacheing info in localstorage
 */

import lzString from "lz-string"

/**
 * Writes to localstorage with key
 * @param key - key to write data
 * @param data - data to write
 */
export const writeCache = (key: string, data: unknown): Promise<void> => (
    new Promise((resolve) => {
        try {
            localStorage.setItem(
                key,
                lzString.compressToUTF16(JSON.stringify(data)),
            )
        } catch {
            return resolve()
        }

        return resolve()
    })
)

/**
 * Reads from localstorage and tries to parse the data
 * @param key - key for data
 */
export const readCache = (key: string): Promise<unknown> => (
    new Promise((resolve) => {
        const data = localStorage.getItem(key)

        if (data === null) {
            return resolve(null)
        }

        try {
            const decompressedData = lzString.decompressFromUTF16(data)

            if (decompressedData) {
                const parsedData = JSON.parse(decompressedData)

                return resolve(parsedData)
            }

            return resolve(null)
        } catch {
            return resolve(null)
        }
    })
)

export default {
    read: readCache,
    write: writeCache,
}
