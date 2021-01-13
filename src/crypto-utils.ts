/**
 * Talentmaker website
 *
 * @copyright (C) 2020 - 2021 Luke Zhang, Ethan Lim
 * https://Luke-zhang-04.github.io
 * https://github.com/ethanlim04
 * @author Luke Zhang
 *
 * @license BSD-3-Clause
 * @file sha256 hashing for browsers
 */

export const hash = async (
    algo: AlgorithmIdentifier,
    data: unknown,
): Promise<string | undefined> => {
    if (!crypto?.subtle?.digest) { // Not supported
        return
    }

    const encodedData = new TextEncoder().encode(JSON.stringify(data)),
        hashBuffer = await crypto.subtle.digest(algo, encodedData),
        hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray.map(bite => bite.toString(16).padStart(2, "0")).join("") // Hex string
}

export default {
    hash,
}
