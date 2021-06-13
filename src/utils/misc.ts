/**
 * Talentmaker website
 *
 * @license BSD-3-Clause
 * @author Luke Zhang
 * @file utility Functions
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 */

/**
 * Splits an array into chunks
 *
 * @param arr - Array to split
 * @param chunkSize - Size of array chunks
 */
export const arrayToChunks = <T extends any>(arr: T[], chunkSize = 3): T[][] => {
    const chunks: T[][] = []

    for (let index = 0; index < arr.length; index += chunkSize) {
        chunks.push(arr.slice(index, index + chunkSize))
    }

    return chunks
}

export default {
    arrayToChunks,
}
