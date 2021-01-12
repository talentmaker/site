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
 * An entry into localstorage
 */
type CacheEntry = {
    lastUsed: number,
    data: string,
}

/**
 * Typegaurd to make sure obj is a cache entry
 */
const isCacheEntry = (obj: unknown): obj is CacheEntry => (
        typeof obj === "object" &&
        typeof (obj as {[key: string]: unknown}).lastUsed === "number" &&
        typeof (obj as {[key: string]: unknown}).data === "string"
    ),

    /**
     * Gets all localstorage cache entries, and removes the oldest ones
     * Also removed problematic cache entries that cause errors
     */
    cleanCache = async (): Promise<void> => (
        await Promise.resolve().then(() => {
            const entries: [lastUsed: number, key: string][] = []

            for (const key of Object.keys(localStorage)) {
                try {
                    const item = localStorage.getItem(key)

                    if (item === null) {
                        // eslint-disable-next-line
                        continue
                    }

                    const parsedItem: unknown = JSON.parse(item)

                    if (isCacheEntry(parsedItem)) {
                        entries.push([parsedItem.lastUsed, key])
                    } else {
                        // eslint-disable-next-line
                        throw undefined
                    }
                } catch {
                    if ((/^talentmakerCache.*/u).test(key)) {
                        localStorage.removeItem(key) // Remove error-causing keys
                    }
                }
            }

            const sortedEntries = entries
                .sort((first, second) => second[0] - first[0]) // Sort from oldest to newest
                .slice(entries.length - entries.length / 8) // Include 1/8 of the storage

            for (const [_, key] of sortedEntries) {
                localStorage.removeItem(key) // Remove storage items
            }
        })
    ),

    /**
     * If localstorage is enabled
     */
    haslocalStorage = ((): boolean => {
        if (localStorage === undefined) {
            return false
        }

        try {
            localStorage.setItem("LSTest", "TEST")

            return localStorage.getItem("LSTest") === "TEST"
        } catch {
            return false
        }
    })()

/**
 * Writes to localstorage with key
 * @param key - key to write data
 * @param data - data to write
 */
export const writeCache = async (key: string, data: unknown): Promise<void> => {
    if (!haslocalStorage) {
        return
    }

    return await Promise.resolve().then(() => {
        try {
            localStorage.setItem(
                key,
                JSON.stringify({
                    lastUsed: Date.now(),
                    data: lzString.compressToUTF16(JSON.stringify(data)),
                }),
            )
        } catch {
            cleanCache()
        }
    })
}

/**
 * Reads from localstorage and tries to parse the data
 * @param key - key for data
 */
export const readCache = async (key: string): Promise<unknown> => {
    if (!haslocalStorage) {
        return
    }

    return await Promise.resolve().then(() => {
        const cacheEntry = localStorage.getItem(key)

        if (cacheEntry === null) {
            return null
        }

        try {
            const parsedCacheEntry: unknown = JSON.parse(cacheEntry)

            if (!isCacheEntry(parsedCacheEntry)) {
                return null
            }

            const decompressedData =
                lzString.decompressFromUTF16(parsedCacheEntry.data)

            if (decompressedData) {
                const parsedData: unknown = JSON.parse(decompressedData)

                return parsedData
            }

            return null
        } catch {
            return null
        }
    })
}

export default {
    read: readCache,
    write: writeCache,
}
